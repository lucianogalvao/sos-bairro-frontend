import * as React from "react";
import type { Occurrence } from "@/features/dashboard/types";
import {
  Alert,
  Box,
  Button,
  ButtonBase,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Typography,
  useTheme,
  TextField,
  MenuItem,
} from "@mui/material";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import RoomOutlinedIcon from "@mui/icons-material/RoomOutlined";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import formatDatePtBR from "@/shared/utils/formatDatePtBR";
import {
  buildGoogleMapsEmbedUrl,
  buildGoogleMapsUrl,
} from "@/shared/utils/buildGoogleUrl";
import normalizeStatusLabel from "@/shared/utils/normalizeStatusLabel";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/store/useAuthStore";
import { categoriesQueries } from "../queries";
import AddressAutocomplete from "@/features/new-occurrence/components/AddressAutocomplete";
import { useUpdateOccurrence } from "@/features/admin-panel/queries";

type Props = {
  detailsOpen: boolean;
  closeDetails: () => void;
  isMobile: boolean;
  isNotebook: boolean;
  selected: Occurrence | null;
  canEdit?: boolean;
  readOnlyReason?: string | null;
  onUpdated?: () => void;
};

type PatchStatusBody = {
  status: "EM_ANALISE" | "RESOLVIDA";
};

type Geo = { lat: number; lng: number };

type ApiErrorResponse = { message?: string };

async function safeJson(res: Response): Promise<ApiErrorResponse | null> {
  try {
    return await res.json();
  } catch {
    return null;
  }
}

export default function DialogDetails({
  detailsOpen,
  closeDetails,
  isMobile,
  isNotebook,
  selected,
  canEdit = false,
  readOnlyReason = null,
}: Props) {
  const theme = useTheme();
  const user = useAuthStore((s) => s.user);
  const canModerate = user?.role === "ADMIN" || user?.role === "MODERADOR";

  const [actionError, setActionError] = React.useState<string | null>(null);

  const queryClient = useQueryClient();

  const [description, setDescription] = React.useState("");
  const [categoryId, setCategoryId] = React.useState<number | "">("");
  const [address, setAddress] = React.useState("");
  const [geo, setGeo] = React.useState<Geo | null>(null);

  const [editError, setEditError] = React.useState<string | null>(null);
  const categoriesQuery = useQuery(categoriesQueries.categories());
  const categoriesNew = Array.isArray(categoriesQuery.data)
    ? categoriesQuery.data
    : categoriesQuery.data?.items;
  const categoriesSafe = React.useMemo(
    () => (Array.isArray(categoriesNew) ? categoriesNew : []),
    [categoriesNew],
  );
  const updateOccurrenceMutation = useUpdateOccurrence();

  React.useEffect(() => {
    if (!selected) {
      setDescription("");
      setCategoryId("");
      setAddress("");
      setGeo(null);
      setEditError(null);
      setActionError(null);
      return;
    }

    setDescription(String(selected.description ?? ""));
    setCategoryId(
      typeof selected.category?.id === "number" ? selected.category.id : "",
    );
    setAddress(String(selected.address ?? ""));
    setGeo(
      selected.locationLatitude != null && selected.locationLongitude != null
        ? { lat: selected.locationLatitude, lng: selected.locationLongitude }
        : null,
    );

    setEditError(null);
    setActionError(null);
  }, [selected]);

  const patchStatusMutation = useMutation({
    mutationFn: async (payload: PatchStatusBody) => {
      if (!selected) throw new Error("Nenhuma ocorrência selecionada");

      const res = await fetch(`/api/occurrences/${selected.id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "include",
        cache: "no-store",
        body: JSON.stringify({ status: payload.status }),
      });

      const data = await safeJson(res);
      if (!res.ok) throw new Error(data?.message ?? "Erro ao alterar status");
      return data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["occurrences"] });
      closeDetails();
    },
    onError: (e) => {
      setActionError(e instanceof Error ? e.message : "Erro ao alterar status");
    },
  });

  const isBusy = patchStatusMutation.isPending;
  const isSaving = updateOccurrenceMutation.isPending;

  function getNextStatusApiValue(
    current: string | undefined | null,
  ): "EM_ANALISE" | "RESOLVIDA" | null {
    if (current === "REGISTRADA") return "EM_ANALISE";
    if (current === "EM_ANALISE") return "RESOLVIDA";
    return null;
  }

  const nextStatus = getNextStatusApiValue(selected?.status);
  const canAdvance = canModerate && !!selected && !!nextStatus;

  const hasCoords =
    selected?.locationLatitude != null && selected?.locationLongitude != null;

  const isReadOnly = !canEdit;

  const categoryTitle = React.useMemo(() => {
    if (!selected) return "-";
    return selected.category?.title ?? "-";
  }, [selected]);

  const categoryLabelForId = React.useMemo(() => {
    if (!categoryId) return "-";
    const found = categoriesSafe.find(
      (c) => Number(c.id) === Number(categoryId),
    );
    return found?.title ?? "-";
  }, [categoriesSafe, categoryId]);

  return (
    <Dialog
      open={detailsOpen}
      onClose={isBusy || isSaving ? undefined : closeDetails}
      fullWidth
      maxWidth="sm"
      fullScreen={isMobile}
      slotProps={{
        paper: {
          sx: {
            m: isMobile ? 0 : 2,
            p: isMobile ? 2 : isNotebook ? 2.5 : 3,
            borderRadius: isMobile ? 0 : 2,
            height: isMobile ? "100svh" : "auto",
            display: "flex",
            flexDirection: "column",
          },
        },
      }}
    >
      <DialogTitle
        sx={{
          fontWeight: 900,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
          p: 0,
          pb: 2,
        }}
      >
        Detalhes
        <IconButton
          size="small"
          onClick={closeDetails}
          aria-label="fechar detalhes"
          disabled={isBusy || isSaving}
        >
          <CloseRoundedIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent
        dividers
        sx={{
          py: 2,
          px: 0,
          flex: 1,
          minHeight: 0,
          overflowY: "auto",
        }}
      >
        {!selected ? (
          <Typography color="text.secondary">
            Selecione uma ocorrência para ver mais informações.
          </Typography>
        ) : (
          <Stack
            component="form"
            spacing={1.2}
            onSubmit={(e) => e.preventDefault()}
          >
            {isReadOnly && readOnlyReason ? (
              <Alert severity="info">{readOnlyReason}</Alert>
            ) : null}

            {isReadOnly ? (
              <Stack spacing={0.6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Descrição
                </Typography>
                <Typography fontWeight={700} sx={{ whiteSpace: "pre-wrap" }}>
                  {description || "-"}
                </Typography>
              </Stack>
            ) : (
              <TextField
                label="Descrição"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                fullWidth
                multiline
                minRows={2}
              />
            )}

            {isReadOnly ? (
              <Stack spacing={0.6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Categoria
                </Typography>
                <Typography fontWeight={700}>
                  {categoryId ? categoryLabelForId : categoryTitle}
                </Typography>
              </Stack>
            ) : (
              <TextField
                label="Categoria"
                select
                value={categoryId}
                onChange={(e) => {
                  const v = String(e.target.value ?? "");
                  setCategoryId(v ? Number(v) : "");
                }}
                fullWidth
                disabled={categoriesSafe.length === 0}
              >
                <MenuItem value="" disabled>
                  Selecione
                </MenuItem>
                {categoriesSafe.map((c) => (
                  <MenuItem key={c.id} value={c.id}>
                    {c.title}
                  </MenuItem>
                ))}
              </TextField>
            )}

            {isReadOnly ? (
              <Stack spacing={0.6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Endereço
                </Typography>
                <Typography fontWeight={700} sx={{ whiteSpace: "pre-wrap" }}>
                  {address || "-"}
                </Typography>
              </Stack>
            ) : (
              <AddressAutocomplete
                previousAddress={address}
                onPick={(data) => {
                  setAddress(data.address);
                  setGeo({ lat: data.lat, lng: data.lng });
                }}
              />
            )}

            {selected.status ? (
              <Typography variant="body2">
                <strong>Status:</strong> {normalizeStatusLabel(selected.status)}
              </Typography>
            ) : null}

            {selected.resident?.name ? (
              <Typography variant="body2">
                <strong>Registrado por:</strong> {selected.resident?.name}
              </Typography>
            ) : null}

            {selected.createdAt ? (
              <Typography variant="body2">
                <strong>Data:</strong> {formatDatePtBR(selected.createdAt)}
              </Typography>
            ) : null}

            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={1.25}
              sx={{ mt: 1 }}
            >
              <Box
                sx={{
                  flex: 1,
                  borderRadius: 1,
                  border: `1px solid ${theme.palette.divider}`,
                  overflow: "hidden",
                  maxHeight: { xs: 160, sm: 250 },
                  position: "relative",
                  backgroundColor:
                    theme.palette.mode === "dark"
                      ? "rgba(255,255,255,0.02)"
                      : "rgba(2,6,23,0.02)",
                }}
              >
                {hasCoords ? (
                  <ButtonBase
                    component="a"
                    href={buildGoogleMapsUrl(
                      selected.locationLatitude!,
                      selected.locationLongitude!,
                    )}
                    target="_blank"
                    rel="noreferrer"
                    sx={{ width: "100%", height: "100%", display: "block" }}
                  >
                    <Box
                      sx={{
                        width: "100%",
                        height: "100%",
                        position: "relative",
                      }}
                    >
                      <Box
                        component="iframe"
                        title="Mapa da ocorrência"
                        src={buildGoogleMapsEmbedUrl(
                          selected.locationLatitude!,
                          selected.locationLongitude!,
                        )}
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        sx={{
                          border: 0,
                          width: "100%",
                          height: "100%",
                          display: "block",
                        }}
                      />
                      <Box
                        sx={{
                          position: "absolute",
                          top: 10,
                          left: 10,
                          display: "flex",
                          alignItems: "center",
                          gap: 0.75,
                          px: 1,
                          py: 0.6,
                          borderRadius: 999,
                          backgroundColor:
                            theme.palette.mode === "dark"
                              ? "rgba(5,11,23,0.82)"
                              : "rgba(255,255,255,0.9)",
                          border: `1px solid ${theme.palette.divider}`,
                        }}
                      >
                        <RoomOutlinedIcon fontSize="small" />
                        <Typography variant="caption" fontWeight={800}>
                          Abrir no Maps
                        </Typography>
                        <OpenInNewIcon fontSize="inherit" />
                      </Box>
                    </Box>
                  </ButtonBase>
                ) : (
                  <Stack
                    height="100%"
                    alignItems="center"
                    justifyContent="center"
                    spacing={1}
                    sx={{ color: theme.palette.text.secondary, p: 2 }}
                  >
                    <RoomOutlinedIcon fontSize="small" />
                    <Typography variant="body2">Sem localização</Typography>
                  </Stack>
                )}
              </Box>

              <Box
                sx={{
                  flex: 1,
                  borderRadius: 1,
                  border: `1px solid ${theme.palette.divider}`,
                  overflow: "hidden",
                  maxHeight: { xs: 160, sm: 250 },
                  position: "relative",
                  backgroundColor:
                    theme.palette.mode === "dark"
                      ? "rgba(255,255,255,0.02)"
                      : "rgba(2,6,23,0.02)",
                }}
              >
                {selected.imageUrl ? (
                  <ButtonBase
                    component="a"
                    href={selected.imageUrl}
                    target="_blank"
                    rel="noreferrer"
                    sx={{ width: "100%", height: "100%", display: "block" }}
                  >
                    <Box
                      component="img"
                      src={selected.imageUrl}
                      alt="Imagem da ocorrência"
                      sx={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        display: "block",
                      }}
                    />
                  </ButtonBase>
                ) : (
                  <Stack
                    height="100%"
                    alignItems="center"
                    justifyContent="center"
                    spacing={1}
                    sx={{ color: theme.palette.text.secondary, p: 2 }}
                  >
                    <ImageOutlinedIcon fontSize="small" />
                    <Typography variant="body2">Sem imagem</Typography>
                  </Stack>
                )}
              </Box>
            </Stack>

            {editError ? <Alert severity="error">{editError}</Alert> : null}

            {canEdit ? (
              <Button
                variant="contained"
                fullWidth
                disabled={
                  updateOccurrenceMutation.isPending ||
                  !selected ||
                  !description.trim() ||
                  !categoryId ||
                  !address.trim() ||
                  !geo
                }
                startIcon={
                  updateOccurrenceMutation.isPending ? (
                    <CircularProgress size={18} color="inherit" />
                  ) : undefined
                }
                onClick={async () => {
                  if (!selected) return;

                  try {
                    setEditError(null);

                    await updateOccurrenceMutation.mutateAsync({
                      id: selected.id,
                      description: description.trim(),
                      categoryId: Number(categoryId),
                      address: address.trim(),
                      locationLatitude: geo?.lat,
                      locationLongitude: geo?.lng,
                    });

                    closeDetails();
                  } catch (e) {
                    setEditError(
                      e instanceof Error
                        ? e.message
                        : "Falha ao atualizar ocorrência",
                    );
                  }
                }}
              >
                <SaveOutlinedIcon fontSize="small" sx={{ mr: 1 }} />
                {updateOccurrenceMutation.isPending
                  ? "Salvando..."
                  : "Salvar alterações"}
              </Button>
            ) : null}

            {canAdvance ? (
              <>
                {actionError ? (
                  <Alert severity="error" sx={{ mt: 1 }}>
                    {actionError}
                  </Alert>
                ) : null}

                <Stack direction="column" spacing={1.5} sx={{ mt: 1.5 }}>
                  <Button
                    variant="contained"
                    color={nextStatus === "RESOLVIDA" ? "success" : "primary"}
                    fullWidth
                    disabled={isBusy}
                    startIcon={
                      isBusy ? (
                        <CircularProgress size={18} color="inherit" />
                      ) : undefined
                    }
                    onClick={async () => {
                      if (!selected || !nextStatus) return;
                      try {
                        setActionError(null);
                        await patchStatusMutation.mutateAsync({
                          status: nextStatus,
                        });
                      } catch (e) {
                        setActionError(
                          e instanceof Error
                            ? e.message
                            : "Erro ao atualizar ocorrência",
                        );
                      }
                    }}
                  >
                    {isBusy
                      ? "Atualizando..."
                      : nextStatus === "EM_ANALISE"
                        ? "Alterar para Em análise"
                        : "Alterar para Resolvida"}
                  </Button>
                </Stack>
              </>
            ) : null}
          </Stack>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 0, py: 2, flexShrink: 0 }}>
        <Button onClick={closeDetails} disabled={isBusy || isSaving}>
          Fechar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

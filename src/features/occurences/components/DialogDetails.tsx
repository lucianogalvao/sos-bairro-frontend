import * as React from "react";
import { Occurrence } from "@/features/dashboard/types";
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
} from "@mui/material";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import RoomOutlinedIcon from "@mui/icons-material/RoomOutlined";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import formatDatePtBR from "@/shared/utils/formatDatePtBR";
import {
  buildGoogleMapsEmbedUrl,
  buildGoogleMapsUrl,
} from "@/shared/utils/buildGoogleUrl";
import normalizeStatusLabel from "@/shared/utils/normalizeStatusLabel";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/store/useAuthStore";

type Props = {
  detailsOpen: boolean;
  closeDetails: () => void;
  isMobile: boolean;
  isNotebook: boolean;
  selected: Occurrence | null;
  onUpdated?: () => void;
};

type PatchStatusBody = {
  status: "EM_ANALISE" | "RESOLVIDA";
};

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
}: Props) {
  const theme = useTheme();
  const user = useAuthStore((s) => s.user);
  const canModerate = user?.role === "ADMIN" || user?.role === "MODERADOR";

  const [actionError, setActionError] = React.useState<string | null>(null);
  const queryClient = useQueryClient();

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

      if (!res.ok) {
        throw new Error(data?.message ?? "Erro ao alterar status");
      }

      return data;
    },

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["occurrences"],
      });

      closeDetails();
    },

    onError: (e) => {
      setActionError(e instanceof Error ? e.message : "Erro ao alterar status");
    },
  });

  const isBusy = patchStatusMutation.isPending;

  function getNextStatusApiValue(
    current: string | undefined | null,
  ): "EM_ANALISE" | "RESOLVIDA" | null {
    if (current === "REGISTRADA") return "EM_ANALISE";
    if (current === "EM_ANALISE") return "RESOLVIDA";
    return null;
  }

  const nextStatus = getNextStatusApiValue(selected?.status);

  const canAdvance = canModerate && !!selected && !!nextStatus;

  return (
    <Dialog
      open={detailsOpen}
      onClose={isBusy ? undefined : closeDetails}
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
          disabled={isBusy}
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
          <Stack spacing={1.2}>
            <Typography fontWeight={900}>{selected.description}</Typography>

            <Typography variant="body2">
              <strong>Categoria:</strong> {selected.category?.title ?? "-"}
            </Typography>

            <Typography variant="body2">
              <strong>Status:</strong> {normalizeStatusLabel(selected.status)}
            </Typography>

            <Typography variant="body2">
              <strong>Registrado por:</strong> {selected.resident?.name ?? "-"}
            </Typography>

            <Typography variant="body2">
              <strong>Data:</strong> {formatDatePtBR(selected.createdAt)}
            </Typography>

            {/* MAP + IMAGE */}
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={1.25}
              sx={{ mt: 1 }}
            >
              {/* MAP */}
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
                {selected.locationLatitude != null &&
                selected.locationLongitude != null ? (
                  <ButtonBase
                    component="a"
                    href={buildGoogleMapsUrl(
                      selected.locationLatitude,
                      selected.locationLongitude,
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
                          selected.locationLatitude,
                          selected.locationLongitude,
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

              {/* IMAGE */}
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

            {/* ACTIONS (ADMIN/MOD) */}
            {canAdvance ? (
              <>
                {actionError && (
                  <Alert severity="error" sx={{ mt: 1 }}>
                    {actionError}
                  </Alert>
                )}

                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={1.5}
                  sx={{ mt: 1.5 }}
                >
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
        <Button onClick={closeDetails} disabled={isBusy}>
          Fechar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

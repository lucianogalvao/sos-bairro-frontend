"use client";

import { useState } from "react";
import { Alert, Box, Button, TextField, Typography, Link } from "@mui/material";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { AuthUser } from "@/store/types";

export function LoginForm() {
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(formData: FormData) {
    setLoading(true);
    setError(null);

    const email = String(formData.get("email") || "").trim();
    const password = String(formData.get("password") || "");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as {
          message?: string;
        } | null;

        setError(body?.message ?? "Falha ao autenticar");
        setLoading(false);
        return;
      }

      const data = (await res.json()) as { user: AuthUser };
      setUser(data.user);

      router.replace("/dashboard");
    } catch {
      setError("Erro de rede ao autenticar");
      setLoading(false);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box
      component="form"
      action={onSubmit}
      display="grid"
      gap={{ xs: 1.25, sm: 2 }}
      sx={{
        width: "100%",
        maxWidth: { xs: 360, sm: 380, md: 400 },
        mx: "auto",
        px: 0.5,
      }}
    >
      <Typography
        color="text.secondary"
        textAlign="center"
        sx={{
          fontSize: { xs: 12.5, sm: 13, md: 14 },
          lineHeight: { xs: 1.25, sm: 1.35 },
          px: 0.5,
          margin: "auto",
          maxWidth: { xs: 250, sm: "100%" },
        }}
      >
        Entre com seu e-mail e senha para acessar o sistema.
      </Typography>

      {error && (
        <Alert severity="error">
          Algo deu errado, verifique seus dados e tente novamente.
        </Alert>
      )}

      <TextField
        name="email"
        label="Email"
        type="email"
        required
        fullWidth
        autoComplete="email"
        inputProps={{ inputMode: "email" }}
        size="small"
      />
      <TextField
        name="password"
        label="Senha"
        type="password"
        required
        fullWidth
        autoComplete="current-password"
        size="small"
      />

      <Button
        type="submit"
        variant="contained"
        size="medium"
        disabled={loading}
        sx={{
          mt: { xs: 0.5, sm: 1 },
          py: { xs: 1, sm: 1.25 },
          fontSize: { xs: 13.5, sm: 15 },
          minHeight: 44,
        }}
      >
        {loading ? "Entrando..." : "Entrar"}
      </Button>

      <Typography
        color="text.secondary"
        textAlign="center"
        sx={{ fontSize: { xs: 12, sm: 13.5 } }}
      >
        Não tem conta?{" "}
        <Link
          component={NextLink}
          href="/register"
          underline="hover"
          sx={{ fontWeight: 600 }}
        >
          Criar agora
        </Link>
      </Typography>
    </Box>
  );
}

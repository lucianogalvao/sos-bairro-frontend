"use client";

import { useState } from "react";
import { Alert, Box, Button, TextField, Typography, Link } from "@mui/material";
import NextLink from "next/link";
import { useRouter } from "next/navigation";

export function LoginForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(formData: FormData) {
    setLoading(true);
    setError(null);

    const email = String(formData.get("email") || "");
    const password = String(formData.get("password") || "");

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => null);
      setError(body?.message ?? "Falha ao autenticar");
      setLoading(false);
      return;
    }

    router.replace("/dashboard");
  }

  return (
    <Box component="form" action={onSubmit} display="grid" gap={2.25}>
      <Typography color="text.secondary" textAlign={"center"}>
        Entre com seu e-mail e senha para acessar o sistema.
      </Typography>

      {error && <Alert severity="error">{error}</Alert>}

      <TextField name="email" label="Email" type="email" required fullWidth />
      <TextField
        name="password"
        label="Senha"
        type="password"
        required
        fullWidth
      />

      <Button
        type="submit"
        variant="contained"
        size="large"
        disabled={loading}
        sx={{ mt: 1, py: 1.4 }}
      >
        {loading ? "Entrando..." : "Entrar"}
      </Button>

      <Typography color="text.secondary" fontSize={14} textAlign="center">
        Não tem conta?{" "}
        <Link component={NextLink} href="/register" underline="hover">
          Criar agora
        </Link>
      </Typography>
    </Box>
  );
}

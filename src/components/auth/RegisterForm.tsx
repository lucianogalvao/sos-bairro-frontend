"use client";

import { useState } from "react";
import { Alert, Box, Button, TextField, Typography, Link } from "@mui/material";
import NextLink from "next/link";
import { useRouter } from "next/navigation";

export function RegisterForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(formData: FormData) {
    setLoading(true);
    setError(null);

    const name = String(formData.get("name") || "");
    const email = String(formData.get("email") || "");
    const password = String(formData.get("password") || "");

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => null);
      setError(body?.message ?? "Falha ao cadastrar");
      setLoading(false);
      return;
    }

    router.replace("/login");
  }

  return (
    <Box
      component="form"
      action={onSubmit}
      display="grid"
      gap={{ xs: 1.5, sm: 2, md: 2.25 }}
      maxWidth={420}
      width="100%"
      mx="auto"
    >
      <Typography
        color="text.secondary"
        textAlign="center"
        fontSize={{ xs: 12.5, sm: 13.5, md: 14 }}
      >
        Crie sua conta para registrar e acompanhar ocorrências.
      </Typography>

      {error && <Alert severity="error">{error}</Alert>}

      <TextField name="name" label="Nome" required fullWidth />
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
        sx={{
          mt: 1,
          py: { xs: 1, sm: 1.2, md: 1.4 },
          fontSize: { xs: 14, sm: 14.5, md: 15 },
        }}
      >
        {loading ? "Criando..." : "Registrar"}
      </Button>

      <Typography
        color="text.secondary"
        fontSize={{ xs: 12.5, sm: 13.5, md: 14 }}
        textAlign="center"
      >
        Já tem conta?{" "}
        <Link component={NextLink} href="/login" underline="hover">
          Entrar
        </Link>
      </Typography>
    </Box>
  );
}

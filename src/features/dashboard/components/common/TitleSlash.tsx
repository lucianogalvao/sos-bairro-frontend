import { Box, Divider, Typography } from "@mui/material";

type Props = {
  title: string;
};

export default function TitleSlash({ title }: Props) {
  return (
    <Box>
      <Typography
        component="h2"
        fontWeight={700}
        sx={(theme) => ({
          fontSize: {
            xs: 18,
            sm: 20,
            md: 22,
            lg: 28,
            notebook: 20,
          },
          lineHeight: 1.15,
          wordBreak: "break-word",
          color: theme.palette.text.primary,
        })}
      >
        {title}
      </Typography>

      <Divider
        sx={(theme) => ({
          mt: { xs: 1.5, md: 2 },
          borderColor: theme.palette.divider,
          opacity: theme.palette.mode === "dark" ? 0.5 : 0.7,
        })}
      />
    </Box>
  );
}

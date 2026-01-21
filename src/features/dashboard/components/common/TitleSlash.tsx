import { Divider, Typography, useTheme } from "@mui/material";

type Props = {
  title: string;
};

export default function TitleSlash({ title }: Props) {
  const theme = useTheme();
  return (
    <Typography variant="h4" fontWeight={700}>
      {title}
      <Divider sx={{ mt: 2, borderColor: theme.palette.text.disabled }} />
    </Typography>
  );
}

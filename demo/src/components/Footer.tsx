import { Link, Select, ui } from "@adamjanicki/ui";
import { type Theme, useTheme } from "src/hooks/useTheme";

const labels = {
  light: "☀️",
  dark: "🌙",
};

export default function Footer() {
  const { theme, setTheme } = useTheme();
  return (
    <ui.footer
      vfx={{
        axis: "y",
        align: "center",
        justify: "center",
        width: "full",
        paddingY: "xxl",
        borderTop: true,
      }}
    >
      <Select
        options={["light", "dark"]}
        value={theme}
        onChange={(e) => setTheme(e.target.value as Theme)}
        getOptionLabel={(option) => labels[option as Theme]}
      />
      <ui.p vfx={{ fontWeight: 5 }}>
        Est. 2024 Built from scratch by{" "}
        <Link target="_blank" rel="noreferrer" to="https://adamjanicki.xyz">
          Adam
        </Link>
      </ui.p>
    </ui.footer>
  );
}

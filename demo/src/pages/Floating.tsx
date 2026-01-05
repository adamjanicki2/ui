import { useState } from "react";
import Para from "src/components/Para";
import Page from "src/components/Page";
import { ShowcaseBlock, ShowcaseRow } from "src/components/Showcase";
import {
  Autocomplete,
  Box,
  Button,
  Icon,
  Link,
  Popover,
  UnstyledButton,
  UnstyledLink,
  ui,
} from "@adamjanicki/ui";
import { ticket } from "@adamjanicki/ui/icons";
import { autoCompleteSnippet, popoversSnippet } from "src/codeSnippets";

const fruits = [
  "Apple 🍎",
  "Banana 🍌",
  "Cherry 🍒",
  "Coconut 🥥",
  "Grape 🍇",
  "Kiwi 🥝",
  "Lemon 🍋",
  "Mango 🥭",
  "Orange 🍊",
  "Peach 🍑",
  "Pear 🍐",
  "Pineapple 🍍",
  "Strawberry 🍓",
  "Watermelon 🍉",
] as const;

const capitalize = (str: string) => str[0].toUpperCase() + str.slice(1);

type Title = {
  type: "movie" | "show";
  title: string;
  year: number;
  rating: number;
};

const titles: readonly Title[] = [
  { title: "Alien", year: 1979, type: "movie", rating: 95 },
  { title: "Andor", year: 2022, type: "show", rating: 92 },
  { title: "Breaking Bad", year: 2008, type: "show", rating: 89 },
  { title: "Inception", year: 2010, type: "movie", rating: 90 },
  { title: "Jackie Brown", year: 1997, type: "movie", rating: 65 },
  { title: "Mr. Robot", year: 2015, type: "show", rating: 93 },
  { title: "North by Northwest", year: 1959, type: "movie", rating: 82 },
  { title: "Pacific Rim", year: 2013, type: "movie", rating: 72 },
  { title: "The Shining", year: 1980, type: "movie", rating: 80 },
  { title: "To Catch a Thief", year: 1955, type: "movie", rating: 83 },
] as const;

export default function FloatingPage() {
  const [popoverOpen1, setPopoverOpen1] = useState(false);
  const [popoverOpen2, setPopoverOpen2] = useState(false);
  const [value1, setValue1] = useState("");
  const [value2, setValue2] = useState("");

  return (
    <Page title="Floating">
      <Para>
        The most complex components in the library are the ones that overlay
        other content without shifting page layout.
      </Para>

      <ShowcaseBlock
        title="Autocomplete"
        description={
          <>
            A searchable select input powered by <ui.code>Popover</ui.code>.
            This is what I use for search bars and searchable selects.
          </>
        }
        snippet={autoCompleteSnippet}
      >
        <ShowcaseRow>
          <Box vfx={{ margin: "xs" }}>
            <Autocomplete
              filterOption={(option) =>
                option.toLowerCase().includes(value1.toLowerCase())
              }
              value={value1}
              onInputChange={(e) => setValue1(e.target.value)}
              options={fruits}
              onSelect={(selected) => setValue1(selected)}
              inputProps={{ placeholder: "Fruits" }}
              popoverProps={{ offset: 8 }}
              customize
            />
          </Box>
          <Box vfx={{ margin: "xs" }}>
            <Autocomplete
              value={value2}
              onInputChange={(e) => setValue2(e.target.value)}
              options={titles}
              filterOption={(option) =>
                option.title.toLowerCase().includes(value2.toLowerCase())
              }
              onSelect={(selected) => setValue2(selected.title)}
              groupBy={(option) => option.type}
              renderGroup={(group) => (
                <Box vfx={{ marginX: "s", marginY: "xs", fontWeight: 7 }}>
                  {capitalize(group)}s
                </Box>
              )}
              renderOption={(option) => (
                <UnstyledLink
                  vfx={{ width: "full", padding: "s" }}
                  newTab
                  to={`https://www.adamovies.com/search?query=${encodeURIComponent(
                    option.title
                  )}`}
                >
                  <ui.span vfx={{ fontWeight: 6 }}>{option.title}</ui.span>
                  <Box vfx={{ color: "muted", fontWeight: 5, fontSize: "xs" }}>
                    {option.year} | {option.rating}%
                  </Box>
                </UnstyledLink>
              )}
              startIcon={
                <Icon icon={ticket} size="m" vfx={{ marginLeft: "s" }} />
              }
              inputProps={{ placeholder: "Reviews" }}
              popoverProps={{ offset: 8 }}
            />
          </Box>
        </ShowcaseRow>
      </ShowcaseBlock>

      <ShowcaseBlock
        title="Popover"
        description={
          <>
            A foundational component for positioning floating content relative
            to another element. Click outside or press Escape to dismiss.
          </>
        }
        snippet={popoversSnippet}
      >
        <ShowcaseRow>
          <Popover
            open={popoverOpen1}
            onClose={() => setPopoverOpen1(false)}
            anchor={
              <Button onClick={() => setPopoverOpen1((prev) => !prev)}>
                Toggle popover
              </Button>
            }
          >
            I'm a popover!
          </Popover>
          <Popover
            open={popoverOpen2}
            onClose={() => setPopoverOpen2(false)}
            placement="bottom-start"
            offset={8}
            vfx={{ axis: "y" }}
            anchor={
              <Button
                variant="secondary"
                onClick={() => setPopoverOpen2((prev) => !prev)}
              >
                Open menu
              </Button>
            }
          >
            <UnstyledButton
              vfx={{ padding: "m", radius: "rounded" }}
              className="aui-autocomplete-option"
            >
              Menu Item 1
            </UnstyledButton>
            <UnstyledButton
              vfx={{ padding: "m", radius: "rounded" }}
              className="aui-autocomplete-option"
            >
              Menu Item 2
            </UnstyledButton>
            <UnstyledButton
              vfx={{ padding: "m", radius: "rounded" }}
              className="aui-autocomplete-option"
            >
              Menu Item 3
            </UnstyledButton>
          </Popover>
        </ShowcaseRow>
      </ShowcaseBlock>

      <ShowcaseBlock
        title="Tooltip"
        description={
          <>
            Tooltips are handy for small bits of contextual information.
            <ui.br />
            TODO: add a <ui.code>Tooltip</ui.code> component + demos here.
          </>
        }
      >
        <Box vfx={{ axis: "y", gap: "s" }}>
          <Para>
            Tooltip isn&apos;t part of this repo yet. For now, check out the
            rest of the floating components above.
          </Para>
          <Para>
            If you need tooltips today, consider using{" "}
            <Link to="https://floating-ui.com/" newTab>
              Floating UI
            </Link>{" "}
            directly.
          </Para>
        </Box>
      </ShowcaseBlock>
    </Page>
  );
}

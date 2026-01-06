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
];

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
  const [fruitValue, setFruitValue] = useState("");
  const [reviewValue, setReviewValue] = useState("");

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
            The autocomplete component is probably the most complex component
            I've ever built; it's very large: boasting a code footprint of over
            300 lines. I mainly use it to power my search bars and searchable
            select fields on{" "}
            <Link to="https://adamovies.com" newTab>
              adamovies.com
            </Link>
            . Check out these examples below on simple and more complex use
            cases!
          </>
        }
        snippet={autoCompleteSnippet}
      >
        <ShowcaseRow>
          <Box vfx={{ margin: "xs" }}>
            <Autocomplete
              value={fruitValue}
              onInputChange={(e) => setFruitValue(e.target.value)}
              options={fruits}
              filterOption={(option) =>
                option.toLowerCase().includes(fruitValue.toLowerCase())
              }
              onSelect={(selected) => setFruitValue(selected)}
              inputProps={{ placeholder: "Fruits" }}
              customize={(query) => query}
            />
          </Box>
          <Box vfx={{ margin: "xs" }}>
            <Autocomplete
              value={reviewValue}
              onInputChange={(e) => setReviewValue(e.target.value)}
              options={titles}
              filterOption={(option) =>
                option.title.toLowerCase().includes(reviewValue.toLowerCase())
              }
              onSelect={(selected) => setReviewValue(selected.title)}
              customize={(query): Title => ({
                title: query,
                type: "movie",
                year: new Date().getFullYear(),
                rating: 0,
              })}
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
            />
          </Box>
        </ShowcaseRow>
      </ShowcaseBlock>

      <ShowcaseBlock
        title="Popover"
        description={
          <>
            The popover component serves as a foundational component for
            overlaying a layer on top of another object while not shifting down
            any page content. It's mounted such that it floats over the rest of
            the page. In fact, this popover component is what powers the
            autocomplete component that we just looked at above!
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
            The tooltip component is a simple component that shows a tooltip
            when hovering over an element. It's a simple component but can be
            very useful, especially when you need to show more information about
            an element without taking up too much space in your main UI. Check
            out the examples below!
          </>
        }
      >
        <Box vfx={{ axis: "y", gap: "s" }}>
          <Para>TODO: coming soon!</Para>
        </Box>
      </ShowcaseBlock>
    </Page>
  );
}

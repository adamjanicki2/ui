import { useMemo, useState } from "react";
import Heading from "src/components/Heading";
import Para from "src/components/Para";
import {
  accordionSnippet,
  animatedSnippet,
  boxSnippet,
  carouselSnippet,
  layerSnippet,
  modalSnippet,
} from "src/codeSnippets";
import { ShowcaseBlock, ShowcaseRow } from "src/components/Showcase";
import {
  Accordion,
  Alert,
  Animated,
  Box,
  Button,
  Carousel,
  Layer,
  Modal,
  Table,
  ui,
} from "@adamjanicki/ui";

export default function Presentation() {
  const [animatedOpen, setAnimatedOpen] = useState(false);
  const [layerOpen, setLayerOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [openDrawers, setOpenDrawers] = useState<Set<number>>(new Set());
  const [sortKey, setSortKey] = useState<keyof (typeof tableItems)[number]>();
  const [sortDirection, setSortDirection] = useState<"none" | "asc" | "desc">(
    "none"
  );

  const sortedTableItems = useMemo(() => {
    if (!sortKey || sortDirection === "none") return tableItems;

    const compareValues = (a: unknown, b: unknown) => {
      if (a == null && b == null) return 0;
      if (a == null) return 1;
      if (b == null) return -1;
      if (typeof a === "number" && typeof b === "number") return a - b;
      return String(a).localeCompare(String(b), undefined, {
        numeric: true,
        sensitivity: "base",
      });
    };

    const sorted = [...tableItems]
      .map((item, index) => ({ item, index }))
      .sort((a, b) => {
        const cmp = compareValues(a.item[sortKey], b.item[sortKey]);
        return cmp !== 0 ? cmp : a.index - b.index;
      })
      .map(({ item }) => item);

    return sortDirection === "asc" ? sorted : sorted.reverse();
  }, [sortDirection, sortKey]);

  return (
    <ui.section id="layout-section">
      <Heading level={1}>Presentation</Heading>
      <Para>
        Perhaps the most foundational of the sections of components within my
        library, the layout and presentation components allow nice composition
        of different types of UI surfaces, from handling simple flexboxes to
        making modals with layers, this section has you covered. This
        technically should be split into two different sections; this combines
        layout and presentational parts.
      </Para>
      <ShowcaseBlock
        title="Accordion"
        snippet={accordionSnippet}
        description={
          <>
            Any webdev is going to know how insanely tricky it is to animate an
            accordion due to it being <em>(for the moment)</em> difficult to
            animate from 0 height to auto height. So this solution is
            inefficient performance wise, but it was still fun to work on
            solving since it's a tricky problem.
          </>
        }
      >
        <Accordion
          vfx={{ marginX: "auto" }}
          style={{ width: "calc(min(100%, 512px))" }}
          drawers={(["success", "info", "error"] as const).map((status, i) => ({
            label: status,
            content: (
              <Box vfx={{ padding: "m", paddingTop: "none" }}>
                <Alert type={status}>We live in a Twilight World.</Alert>
              </Box>
            ),
            open: openDrawers.has(i),
            onOpenChange: (open) =>
              setOpenDrawers((prev) => {
                const next = new Set(prev);
                if (open) {
                  next.add(i);
                } else {
                  next.delete(i);
                }
                return next;
              }),
          }))}
        />
      </ShowcaseBlock>

      <ShowcaseBlock
        title="Animated"
        snippet={animatedSnippet}
        description={
          <>
            This is a simple wrapper component that allows you to perform
            animations on mount and unmount of a given element. I found it
            useful when designing a custom modal for one of my other sites that
            I wanted to fade in and out when the user entered or exited the
            state.
          </>
        }
      >
        <ShowcaseRow vfx={{ axis: "y", gap: "s", padding: "none" }}>
          <Button
            vfx={{ width: "fit" }}
            onClick={() => setAnimatedOpen(!animatedOpen)}
          >
            {animatedOpen ? "Unanimate" : "Animate"} Alert
          </Button>
          <Animated
            keepMounted
            duration={1}
            visible={animatedOpen}
            animateTo={{
              style: { opacity: 1, transform: "rotate(0)" },
            }}
            animateFrom={{
              style: { opacity: 0, transform: "rotate(0.5turn)" },
            }}
            vfx={{ width: "full" }}
          >
            <Alert type="info">This is an animated alert!</Alert>
          </Animated>
        </ShowcaseRow>
      </ShowcaseBlock>

      <ShowcaseBlock
        title="Box"
        snippet={boxSnippet}
        description={
          <>
            I wanted something to standardize the layouts of my pages instead of
            having a ton of random <ui.code>div</ui.code>s strewn across the
            page. But more than that, it makes my code more readable by exposing
            easier-to-understand props like <ui.code>axis</ui.code> to control
            the flex direction.
          </>
        }
      >
        <Box
          vfx={{
            axis: "x",
            align: "end",
            justify: "center",
            padding: "xs",
            gap: "xs",
            border: true,
            borderColor: "primary",
          }}
        >
          <Box
            vfx={{
              axis: "y",
              align: "center",
              justify: "center",
              padding: "m",
              border: true,
              borderColor: "primary",
            }}
          >
            L
          </Box>
          <Box
            vfx={{
              axis: "y",
              align: "center",
              justify: "center",
              padding: "xl",
              border: true,
              borderColor: "primary",
            }}
          >
            XL
          </Box>
          <Box
            vfx={{
              axis: "y",
              align: "center",
              justify: "center",
              padding: "xxl",
              border: true,
              borderColor: "primary",
            }}
          >
            XXL
          </Box>
        </Box>
      </ShowcaseBlock>

      <ShowcaseBlock
        title="Carousel"
        snippet={carouselSnippet}
        description={
          <>
            I've wanted to build some sort of site that could show off a collage
            of pictures that I've been taking on recent trips. I figured it'd be
            cool to have the page segmented by trip, and each trip would have a
            carousel of images, which is why I needed this component. This one
            ended up being one of the more tricky things in this library to
            implement due to all of the complex CSS involved.
          </>
        }
      >
        <Carousel
          vfx={{ marginX: "auto", radius: "rounded" }}
          className="white"
          autoplayInterval={5}
        >
          <Box
            vfx={{ paddingY: "xxl", textAlign: "center", fontSize: "xl" }}
            className="bg-red"
          >
            "We live in a twilight world"
          </Box>
          <Box
            vfx={{ paddingY: "xxl", textAlign: "center", fontSize: "xl" }}
            className="bg-purple"
          >
            "We live in a twilight world"
          </Box>
          <Box
            vfx={{ paddingY: "xxl", textAlign: "center", fontSize: "xl" }}
            className="bg-blue"
          >
            "We live in a twilight world"
          </Box>
        </Carousel>
      </ShowcaseBlock>

      <ShowcaseBlock
        title="Layer"
        snippet={layerSnippet}
        description={
          <>
            The layer component is a simple wrapper that allows you to create a
            layer on top of your content. This is particularly useful when you
            want to create a modal or a dropdown menu that should cover the
            entire screen.
          </>
        }
      >
        <ShowcaseRow vfx={{ axis: "y", gap: "s", padding: "none" }}>
          <Button vfx={{ width: "fit" }} onClick={() => setLayerOpen(true)}>
            Open layer
          </Button>
          {layerOpen && (
            <Layer onClose={() => setLayerOpen(false)}>
              <Box
                vfx={{ padding: "xl", radius: "rounded", shadow: "floating" }}
                className="bg-green"
              >
                <h1>Hello!</h1>
              </Box>
            </Layer>
          )}
        </ShowcaseRow>
      </ShowcaseBlock>

      <ShowcaseBlock
        title="Modal"
        snippet={modalSnippet}
        description={
          <>
            Built as a simple wrapper on top of the lower-level Layer component,
            the Modal component seeks to provide an easy interface for commonly
            used modal design patterns, providing props for doing something on
            confirm and close.
          </>
        }
      >
        <ShowcaseRow vfx={{ axis: "y", gap: "s", padding: "none" }}>
          <Button vfx={{ width: "fit" }} onClick={() => setModalOpen(true)}>
            Open Modal
          </Button>
          <Modal
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            onConfirm={() => {}}
          >
            <Box>
              Welcome to my modal. You can put all sorts of stuff in here if
              you'd like.
            </Box>
          </Modal>
        </ShowcaseRow>
      </ShowcaseBlock>

      <ShowcaseBlock
        title="Table"
        description={
          <>
            This quite possibly could contain the most complex TypeScripting
            I've done in my life to get the types for the table rows good. It
            also contains some of the most annoying styling I've had to do to
            date.
          </>
        }
      >
        <Box vfx={{ axis: "y", align: "center" }}>
          <Table
            gutters
            items={sortedTableItems}
            columns={tableColumns}
            vfx={{ width: "full" }}
            sort={{
              key: sortKey,
              direction: sortDirection,
              onSort: (key, direction) => {
                setSortDirection(direction);
                setSortKey(direction === "none" ? undefined : key);
              },
            }}
            routeTo={(item) => ({
              to: `https://adamovies.com/review/${item.title
                .toLowerCase()
                .split(/\s+/)
                .join("-")}`,
              newTab: true,
            })}
          />
        </Box>
      </ShowcaseBlock>
    </ui.section>
  );
}

const tableItems = [
  {
    id: "1",
    title: "Interstellar",
    director: "Christopher Nolan",
    year: 2014,
    genre: "Sci-Fi",
    rating: 99,
    logline: "Humanity was born on Earth; it was never meant to die here.",
  },
  {
    id: "2",
    title: "Alien",
    director: "Ridley Scott",
    year: 1979,
    genre: "Sci-Fi Horror",
    rating: 96,
    logline: "In space, no one can hear you scream.",
  },
  {
    id: "3",
    title: "Raiders of the Lost Ark",
    director: "Steven Spielberg",
    year: 1981,
    genre: "Adventure",
    rating: 94,
    logline: "Snakes... Why'd it have to be snakes?",
  },
  {
    id: "4",
    title: "The Shawshank Redemption",
    director: "Frank Darabont",
    year: 1994,
    genre: "Drama",
    rating: 94,
    logline: "Fear can hold you prisoner; hope can set you free.",
  },
  {
    id: "5",
    title: "The Dark Knight",
    director: "Christopher Nolan",
    year: 2008,
    genre: "Action",
    rating: 93,
    logline: "I'm Batman.",
  },
  {
    id: "6",
    title: "Jurassic Park",
    director: "Steven Spielberg",
    year: 1993,
    genre: "Adventure",
    rating: 92,
    logline: "An adventure 65 million years in the making.",
  },
] as const;

const tableColumns = [
  { key: "title", header: "Title", sortable: true },
  { key: "director", header: "Director", sortable: true },
  { key: "year", header: "Year", sortable: true },
  { key: "genre", header: "Genre", sortable: true },
  { key: "rating", header: "Adamovies", sortable: true },
  { key: "logline", header: "Logline" },
] as const;

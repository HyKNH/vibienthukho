'use client';

import { FaSearch } from "react-icons/fa";
import { Autocomplete, Burger, Group } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import classes from "./HeaderSearch.module.css";
import { Logo } from "../Logo";

const links = [
  { link: "/", label: "Home" },
  { link: "/library", label: "Library" },
  { link: "/dictionary", label: "Dictionary" },
  { link: "/faq", label: "FAQ" },
];

export function Header() {
  const [opened, { toggle }] = useDisclosure(false);

  const items = links.map((link) => (
    <a
      key={link.label}
      href={link.link}
      className={classes.link}
      onClick={(event) => event.preventDefault()}
    >
      {link.label}
    </a>
  ));

  return (
    <header className={classes.header}>
      <div className={classes.inner}>
        {/* Left Group: Burger and Logo */}
        <Group>
          <Burger opened={opened} onClick={toggle} size="sm" hiddenFrom="sm" />
          <div className={classes.logoContainer}>
            <div className={classes.logo}>
              <Logo />
            </div>
            <div> 
              <span className={classes.geistText}>Vi Biên thư khố</span>
              <span className={classes.chineseText}>韋編書庫</span>
            </div>
          </div>
        </Group>

        {/* Right Group: Navigation Links and Search */}
        <Group>
          <Group ml={50} gap={5} className={classes.links} visibleFrom="sm">
            {items}
          </Group>
          <Autocomplete
            className={classes.search}
            placeholder="Search"
            leftSection={<FaSearch size={16} />}
            data={[
              "React",
              "Angular",
              "Vue",
              "Next.js",
              "Riot.js",
              "Svelte",
              "Blitz.js",
            ]}
            visibleFrom="xs"
          />
        </Group>
      </div>
    </header>
  );
}

'use client';

import { Burger, Group } from "@mantine/core";
import {Input} from "@nextui-org/react";
import { FaSearch } from "react-icons/fa";
import { useDisclosure } from "@mantine/hooks";
import classes from "./HeaderSearch.module.css";
import { Logo } from "../Logo";

const links = [
  { link: "/", label: "Home" },
  { link: "/library", label: "Library" },
  { link: "/dictionary", label: "Dictionary" },
];

export function Header() {
  const [opened, { toggle }] = useDisclosure(false);

  const items = links.map((link) => (
    <a
      key={link.label}
      href={link.link}
      className={`${classes.link} ${link.label === "Home" ? classes.homeLink : ""}`}
    >
      {link.label}
    </a>
  ));

  return (
    <header className={classes.header}>
      <div className={classes.inner}>
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

        <Group className={classes.rightGroup}>
          <Group className={classes.linksGroup} visibleFrom="sm">
            <div className={classes.links}>{items}</div>
          </Group>
          <Input
            isClearable
            classNames={{
            label: "text-black/50 dark:text-white/90",
            input: [
              "bg-transparent",
              "text-black/90 dark:text-white/90",
              "placeholder:text-default-700/50 dark:placeholder:text-white/60",
            ],
            innerWrapper: "bg-transparent",
            inputWrapper: [
              "shadow-xl",
              "bg-default-200/50",
              "dark:bg-default/60",
              "backdrop-blur-xl",
              "backdrop-saturate-200",
              "hover:bg-default-200/70",
              "dark:hover:bg-default/70",
              "group-data-[focus=true]:bg-default-200/50",
              "dark:group-data-[focus=true]:bg-default/60",
              "!cursor-text",
            ],
            }}
            label="Search"
            placeholder="Type to search..."
            radius="lg"
            startContent={
              <FaSearch />
            }
          />
        </Group>
      </div>
    </header>
  );
}

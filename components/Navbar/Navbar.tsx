'use client';

import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Anchor, Burger, Flex, Group, Menu, NavLink, Text } from '@mantine/core';
import { useDisclosure, useViewportSize } from '@mantine/hooks';
import AniList from '@/img/AniList.svg';
import Lastfm from '@/img/Lastfm.svg';
import MyAnimeList from '@/img/MyAnimeList.svg';
import Trakt from '@/img/Trakt.svg';
import { createClient } from '@/lib/supabase/client';

export default function Navbar() {
  const [opened, { toggle }] = useDisclosure();
  const { width } = useViewportSize();
  return (
    <>
      <Flex
        justify="space-between"
        align={{ base: 'flex-start', sm: 'center' }}
        direction={{ base: 'column', sm: 'row' }}
        h={{ base: !opened ? 'auto' : '100vh', sm: 'auto' }}
        w={{ base: '100vw', sm: 'auto' }}
      >
        {/* Left/Top */}
        <Group>
          <Burger opened={opened} onClick={toggle} aria-label="Toggle navigation" hiddenFrom="sm" />
          <Text>Media RSS</Text>
        </Group>
        {/* Middle */}
        <Flex
          display={{ base: opened ? 'flex' : 'none', sm: 'flex' }}
          direction={{ base: 'column', sm: 'row' }}
          align={{ base: 'flex-start', sm: 'center' }}
        >
          <NavLink component={Link} href="/" variant="subtle" label="Home" />
          {width >= 768 ? (
            <Menu trigger="hover" openDelay={100} closeDelay={400}>
              <Menu.Target>
                <NavLink
                  variant="subtle"
                  rightSection={<FontAwesomeIcon icon={faChevronDown} />}
                  label="Sources"
                />
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item
                  leftSection={<Image src={Lastfm} alt="Last.fm" width={20} height={20} />}
                >
                  <Anchor component={Link} href="/source/lastfm" c="inherit">
                    Last.fm
                  </Anchor>
                </Menu.Item>
                <Menu.Item
                  leftSection={<Image src={AniList} alt="AniList" width={20} height={20} />}
                >
                  <Anchor component={Link} href="/source/anilist" c="inherit">
                    AniList
                  </Anchor>
                </Menu.Item>
                <Menu.Item
                  leftSection={<Image src={MyAnimeList} alt="MyAnimeList" width={20} height={20} />}
                >
                  <Anchor component={Link} href="/source/myanimelist" c="inherit">
                    MyAnimeList
                  </Anchor>
                </Menu.Item>
                <Menu.Item leftSection={<Image src={Trakt} alt="Trakt" width={20} height={20} />}>
                  <Anchor component={Link} href="/source/trakt" c="inherit">
                    Trakt
                  </Anchor>
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          ) : (
            <>
              <NavLink
                component={Link}
                href="/source/lastfm"
                variant="subtle"
                label="Last.fm"
                leftSection={<Image src={Lastfm} alt="Last.fm" width={20} height={20} />}
              />
              <NavLink
                component={Link}
                href="/source/anilist"
                variant="subtle"
                label="AniList"
                leftSection={<Image src={AniList} alt="AniList" width={20} height={20} />}
              />
              <NavLink
                component={Link}
                href="/source/myanimelist"
                variant="subtle"
                label="MyAnimeList"
                leftSection={<Image src={MyAnimeList} alt="MyAnimeList" width={20} height={20} />}
              />
              <NavLink
                component={Link}
                href="/source/trakt"
                variant="subtle"
                label="Trakt"
                leftSection={<Image src={Trakt} alt="Trakt" width={20} height={20} />}
              />
            </>
          )}
          <NavLink variant="subtle" label="Filters" />
        </Flex>
        {/* Right/Bottom */}
        <Flex
          display={{ base: opened ? 'flex' : 'none', sm: 'flex' }}
          direction={{ base: 'column', sm: 'row' }}
          align={{ base: 'flex-start', sm: 'center' }}
        >
          <NavLink
            variant="subtle"
            label="Logout"
            onClick={() => {
              const supabase = createClient();
              supabase.auth.signOut();
              redirect('/login');
            }}
          />
        </Flex>
      </Flex>
    </>
  );
}

import type React from 'react';
import SiReact from '@icons-pack/react-simple-icons/icons/SiReact';
import SiNextdotjs from '@icons-pack/react-simple-icons/icons/SiNextdotjs';
import SiTypescript from '@icons-pack/react-simple-icons/icons/SiTypescript';
import SiJavascript from '@icons-pack/react-simple-icons/icons/SiJavascript';
import SiTailwindcss from '@icons-pack/react-simple-icons/icons/SiTailwindcss';
import SiFlutter from '@icons-pack/react-simple-icons/icons/SiFlutter';
import SiLaravel from '@icons-pack/react-simple-icons/icons/SiLaravel';
import SiNodedotjs from '@icons-pack/react-simple-icons/icons/SiNodedotjs';
import SiMysql from '@icons-pack/react-simple-icons/icons/SiMysql';
import SiPostgresql from '@icons-pack/react-simple-icons/icons/SiPostgresql';
import SiSupabase from '@icons-pack/react-simple-icons/icons/SiSupabase';
import SiFirebase from '@icons-pack/react-simple-icons/icons/SiFirebase';
import SiPrisma from '@icons-pack/react-simple-icons/icons/SiPrisma';
import SiDocker from '@icons-pack/react-simple-icons/icons/SiDocker';
import SiLinux from '@icons-pack/react-simple-icons/icons/SiLinux';
import SiGit from '@icons-pack/react-simple-icons/icons/SiGit';
import SiVercel from '@icons-pack/react-simple-icons/icons/SiVercel';

export type TechIconComponent = React.ComponentType<{
  size?: number | string;
  color?: string;
  className?: string;
}>;

export const techIconMap: Record<string, TechIconComponent> = {
  react: SiReact,
  nextdotjs: SiNextdotjs,
  typescript: SiTypescript,
  javascript: SiJavascript,
  tailwindcss: SiTailwindcss,
  flutter: SiFlutter,
  laravel: SiLaravel,
  nodejs: SiNodedotjs,
  mysql: SiMysql,
  postgresql: SiPostgresql,
  supabase: SiSupabase,
  firebase: SiFirebase,
  prisma: SiPrisma,
  docker: SiDocker,
  linux: SiLinux,
  git: SiGit,
  vercel: SiVercel
};


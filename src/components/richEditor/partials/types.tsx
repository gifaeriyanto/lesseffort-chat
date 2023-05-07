import React from 'react';
import {
  FaBold,
  FaItalic,
  FaListOl,
  FaListUl,
  FaStrikethrough,
} from 'react-icons/fa';

export const BLOCK_TYPES = [
  // 'header-one',
  // 'header-two',
  // 'header-three',
  // 'header-four',
  // 'header-five',
  // 'header-six',
  // 'blockquote',
  // 'code-block',

  // Supported only
  {
    label: 'Unordered list',
    icon: <FaListUl />,
    blockType: 'unordered-list-item',
  },
  {
    label: 'Ordered list',
    icon: <FaListOl />,
    blockType: 'ordered-list-item',
  },
];

export const INLINE_STYLES = [
  {
    label: 'Bold',
    icon: <FaBold />,
    styleType: 'BOLD',
    shortcut: ['ctrl', 'b'],
  },
  {
    label: 'Italic',
    icon: <FaItalic />,
    styleType: 'ITALIC',
    shortcut: ['ctrl', 'b'],
  },
  {
    label: 'Strikethrough',
    icon: <FaStrikethrough />,
    styleType: 'STRIKETHROUGH',
    shortcut: ['ctrl', 'shift', 'x'],
  },
];

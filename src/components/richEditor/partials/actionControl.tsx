import React, { useEffect } from 'react';
import {
  HStack,
  IconButton,
  IconButtonProps,
  Tag,
  Text,
  Tooltip,
  useBoolean,
  VStack,
} from '@chakra-ui/react';
import {
  BLOCK_TYPES,
  INLINE_STYLES,
} from 'components/richEditor/partials/types';
import { RichEditorActionIconStyleProps } from 'components/richEditor/richEditor.styles';
import { EditorState } from 'draft-js';

export interface ActionControlProps
  extends Omit<IconButtonProps, 'aria-label'> {
  icon: React.ReactElement;
  label: string;
  shortcut?: string[];
}

export const ActionControl: React.FC<ActionControlProps> = ({
  icon,
  label,
  shortcut,
  ...props
}) => {
  const [isMac, { on }] = useBoolean(false);

  useEffect(() => {
    if (window.navigator.appVersion.indexOf('Mac') !== -1) {
      on();
    }
  });

  return (
    <Tooltip
      openDelay={1000} // 1000ms = 1s
      closeOnClick
      label={
        <VStack spacing={2}>
          <Text fontWeight="bold">{label}</Text>
          {shortcut && (
            <HStack spacing={1}>
              {shortcut.map((key) => (
                <Tag
                  key={key}
                  p={1}
                  justifyContent="center"
                  borderRadius="sm"
                  textAlign="center"
                  colorScheme="whiteAlpha"
                >
                  {key === 'ctrl' && isMac ? '⌘' : key}
                </Tag>
              ))}
            </HStack>
          )}
        </VStack>
      }
      aria-label={`${label} button`}
    >
      <IconButton
        key={label}
        label={label}
        aria-label={label}
        icon={icon}
        {...RichEditorActionIconStyleProps}
        {...props}
      />
    </Tooltip>
  );
};

export interface StyleControlsProps {
  editorState: EditorState;
  onToggle: (blockType: string) => void;
}

export const BlockStyleControls: React.FC<StyleControlsProps> = ({
  editorState,
  onToggle,
}) => {
  const selection = editorState.getSelection();
  const currentBlockType = editorState
    .getCurrentContent()
    .getBlockForKey(selection.getStartKey())
    .getType();

  const handleToggle = (e: React.MouseEvent, blockType: string) => {
    e.preventDefault();
    onToggle(blockType);
  };

  return (
    <HStack spacing={1}>
      {BLOCK_TYPES.map((type) => (
        <ActionControl
          key={type.label}
          icon={type.icon}
          isActive={type.blockType === currentBlockType}
          label={type.label}
          onMouseDown={(e) => handleToggle(e, type.blockType)}
        />
      ))}
    </HStack>
  );
};

export const InlineStyleControls: React.FC<StyleControlsProps> = ({
  editorState,
  onToggle,
}) => {
  const currentStyle = editorState.getCurrentInlineStyle();

  const handleToggle = (e: React.MouseEvent, styleType: string) => {
    e.preventDefault();
    onToggle(styleType);
  };

  return (
    <HStack spacing={1}>
      {INLINE_STYLES.map((style) => (
        <ActionControl
          key={style.label}
          icon={style.icon}
          isActive={currentStyle.has(style.styleType)}
          label={style.label}
          onMouseDown={(e) => handleToggle(e, style.styleType)}
          shortcut={style.shortcut}
          {...RichEditorActionIconStyleProps}
        />
      ))}
    </HStack>
  );
};

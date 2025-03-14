import React, { useLayoutEffect, useRef, useState } from 'react';
import { Box, useMediaQuery } from '@chakra-ui/react';
import { RichEditorTextareaStyle } from 'components/richEditor/richEditor.styles';
import {
  ContentState,
  DraftHandleValue,
  Editor,
  EditorState,
  getDefaultKeyBinding,
  KeyBindingUtil,
  Modifier,
  RichUtils,
  SelectionState,
} from 'draft-js';
import { useChat } from 'store/chat';
import { isRelaxMode } from 'utils/url';
import { shallow } from 'zustand/shallow';

export interface RichEditorProps {
  addon?: React.ReactElement;
  defaultValue?: string;
  onBlur?: (value: string) => void;
  onSubmit?: (value: string) => void;
  placeholder?: string;
  isDisabled?: boolean;
}

export const RichEditor: React.FC<RichEditorProps> = ({
  addon,
  defaultValue,
  onBlur,
  onSubmit,
  placeholder,
  isDisabled,
}) => {
  const [isLessThanMd] = useMediaQuery('(max-width: 48em)');
  const initialEditorState = defaultValue
    ? EditorState.createWithContent(ContentState.createFromText(defaultValue))
    : EditorState.createEmpty();
  const [editorState, setEditorState] = useState(initialEditorState);
  const isEmpty = !editorState.getCurrentContent().hasText();
  const richEditorRef = useRef<Editor>(null);
  const setRichEditorRef = useChat((state) => state.setRichEditorRef, shallow);

  useLayoutEffect(() => {
    if (richEditorRef.current) {
      setRichEditorRef(richEditorRef);
    }
  }, [richEditorRef.current]);

  const handleKeyCommand = (
    command: string,
    state: EditorState,
  ): DraftHandleValue => {
    // inline formatting key commands handles bold, italic, code, underline
    let newEditorState = RichUtils.handleKeyCommand(
      state,
      command,
    ) as EditorState | null;

    /*
      If RichUtils.handleKeyCommand didn't find anything,
      check for our custom strikethrough command and call
      `RichUtils.toggleInlineStyle` if we find it.
    */
    if (!newEditorState && command === 'strikethrough') {
      newEditorState = RichUtils.toggleInlineStyle(state, 'STRIKETHROUGH');
    }

    if (newEditorState) {
      setEditorState(newEditorState);
      return 'handled';
    }
    return 'not-handled';
  };

  const handleClear = () => {
    let editorStateTmp = editorState;
    let contentStateTmp = editorStateTmp.getCurrentContent();
    const firstBlock = contentStateTmp.getFirstBlock();
    const lastBlock = contentStateTmp.getLastBlock();
    const allSelected = new SelectionState({
      anchorKey: firstBlock.getKey(),
      anchorOffset: 0,
      focusKey: lastBlock.getKey(),
      focusOffset: lastBlock.getLength(),
      hasFocus: true,
    });
    contentStateTmp = Modifier.removeRange(
      contentStateTmp,
      allSelected,
      'backward',
    );
    editorStateTmp = EditorState.push(
      editorStateTmp,
      contentStateTmp,
      'remove-range',
    );
    setEditorState(editorStateTmp);
  };

  const getValueEditorState = () => {
    return editorState.getCurrentContent().getPlainText();
  };

  const handleSubmit = () => {
    if (onSubmit && !isEmpty) {
      const value = getValueEditorState();
      onSubmit(value);
      handleClear();
    }
  };

  const handleKeyBinding = (e: React.KeyboardEvent) => {
    if (KeyBindingUtil.hasCommandModifier(e) && e.shiftKey && e.key === 'x') {
      return 'strikethrough';
    }

    if (
      (!isLessThanMd || isRelaxMode()) &&
      onSubmit &&
      !e.shiftKey &&
      e.key === 'Enter'
    ) {
      handleSubmit();
      return 'submit';
    }

    return getDefaultKeyBinding(e);
  };

  const handleBlur = () => {
    if (onBlur) {
      const value = getValueEditorState();
      onBlur(value);
    }
  };

  const getPlaceholder = () => {
    const contentState = editorState.getCurrentContent();
    if (contentState.getBlockMap().first().getType() !== 'unstyled') {
      return undefined;
    }
    return 'Send a message...';
  };

  return (
    <Box overflowY="auto" maxH="30vh" sx={RichEditorTextareaStyle}>
      <Box p={4} borderTopRadius="md">
        <Editor
          editorState={editorState}
          handleKeyCommand={handleKeyCommand}
          keyBindingFn={handleKeyBinding}
          onBlur={handleBlur}
          onChange={setEditorState}
          placeholder={placeholder || getPlaceholder()}
          stripPastedStyles
          ref={richEditorRef}
          readOnly={isDisabled}
        />
      </Box>
    </Box>
  );
};

import { Message } from 'api/chat';
import { chatRulesPrompt } from 'components/chat/rules';
import { modifyTemplate } from 'store/chat';

export const mapMessage = (message: Message) => {
  let content = message.content;
  if (message.template) {
    content = modifyTemplate(message.content, message.template, message.rules);
  } else {
    if (message.rules) {
      content += chatRulesPrompt(message.rules);
    }
  }

  return {
    content,
    role: message.role,
  };
};

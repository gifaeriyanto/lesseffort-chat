import React, { useLayoutEffect, useMemo, useState } from 'react';
import { HStack, IconButton, Select, SelectProps } from '@chakra-ui/react';
import { TbX } from 'react-icons/tb';
import { CustomColor } from 'theme/foundations/colors';

export interface Rules {
  outputLanguage: string;
  tone: string;
  writingStyle: string;
  format: string;
}

export interface ChatRulesProps {
  value?: Rules;
  getActiveRules?: (activeRulesCount: number) => void;
  onChange?: (rules: Rules) => void;
  onClose?: () => void;
  hidden?: Array<keyof Rules>;
}

export const chatRulesPrompt = (rules: Rules) => {
  const prompts = [];

  if (rules.outputLanguage) {
    prompts.push(`${rules.outputLanguage} language`);
  }
  if (rules.tone) {
    prompts.push(`${rules.tone} tone`);
  }
  if (rules.writingStyle) {
    prompts.push(`${rules.writingStyle} style`);
  }

  let prompt =
    prompts.length > 0 ? `Please respond with ${prompts.join(', ')}. ` : '';
  if (rules.format) {
    prompt += rules.format;
  }

  return prompt ? `\n\n${prompt}` : '';
};

export const defaultRules: Rules = {
  outputLanguage: '',
  tone: '',
  writingStyle: '',
  format: '',
};

export const ChatRules: React.FC<ChatRulesProps> = ({
  value,
  getActiveRules,
  onChange,
  onClose,
  hidden,
}) => {
  const [rules, setRules] = useState(defaultRules);

  useLayoutEffect(() => {
    if (value) {
      setRules(value);
    }
  }, [value]);

  const activeRulesCount = useMemo(() => {
    return Object.entries(rules).reduce((prev, [key, value]) => {
      if (value) {
        return prev + 1;
      }
      return prev;
    }, 0);
  }, [rules]);

  useLayoutEffect(() => {
    getActiveRules?.(activeRulesCount);
  }, [activeRulesCount]);

  const handleChange =
    (name: keyof Rules) => (e: React.ChangeEvent<HTMLSelectElement>) => {
      setRules({
        ...rules,
        [`${name}`]: e?.currentTarget?.value || '',
      });
    };

  const handleClear = () => {
    setRules(defaultRules);
    onClose?.();
  };

  useLayoutEffect(() => {
    onChange?.(rules);
  }, [rules]);

  const selectProps = (name: keyof Rules, placeholder: string): SelectProps => {
    return {
      variant: 'outline',
      maxW: '200px',
      size: 'sm',
      borderRadius: 'xl',
      placeholder,
      value: rules[name],
      onChange: handleChange(name),
      isDisabled: hidden?.includes(name),
      borderColor: rules[name] ? 'blue.500' : CustomColor.border,
      focusBorderColor: 'blue.300',
      _light: {
        // border: rules[name] ? '2px solid' : '1px solid',
        borderColor: rules[name] ? 'blue.500' : CustomColor.lightBorder,
        bgColor: rules[name] ? 'white' : 'inherit',
      },
    };
  };

  return (
    <HStack spacing={4} justify="center" align="center" w="full">
      <Select {...selectProps('outputLanguage', 'Output Language')}>
        <option value="English">English</option>
        <option value="Spanish">Español</option>
        <option value="French">Français</option>
        <option value="German">Deutsch</option>
        <option value="Italian">Italiano</option>
        <option value="Portuguese">Português</option>
        <option value="Polish">Polski</option>
        <option value="Ukrainian">Українська</option>
        <option value="Somali">Af Soomaali</option>
        <option value="Afrikaans">Afrikaans</option>
        <option value="Azerbaijani">Azərbaycan dili</option>
        <option value="Indonesian">Bahasa Indonesia</option>
        <option value="Malaysian Malay">Bahasa Malaysia</option>
        <option value="Malay">Bahasa Melayu</option>
        <option value="Javanese">Basa Jawa</option>
        <option value="Sundanese">Basa Sunda</option>
        <option value="Bosnian">Bosanski jezik</option>
        <option value="Catalan">Català</option>
        <option value="Czech">Čeština</option>
        <option value="Chichewa">Chichewa</option>
        <option value="Welsh">Cymraeg</option>
        <option value="Danish">Dansk</option>
        <option value="German">Deutsch</option>
        <option value="Estonian">Eesti keel</option>
        <option value="English">English</option>
        <option value="English (UK)">English (UK)</option>
        <option value="English (US)">English (US)</option>
        <option value="Spanish">Español</option>
        <option value="Esperanto">Esperanto</option>
        <option value="Basque">Euskara</option>
        <option value="French">Français</option>
        <option value="Irish">Gaeilge</option>
        <option value="Galician">Galego</option>
        <option value="Croatian">Hrvatski jezik</option>
        <option value="Xhosa">isiXhosa</option>
        <option value="Zulu">isiZulu</option>
        <option value="Icelandic">Íslenska</option>
        <option value="Italian">Italiano</option>
        <option value="Swahili">Kiswahili</option>
        <option value="Haitian Creole">Kreyòl Ayisyen</option>
        <option value="Kurdish">Kurdî</option>
        <option value="Latin">Latīna</option>
        <option value="Latvian">Latviešu valoda</option>
        <option value="Luxembourgish">Lëtzebuergesch</option>
        <option value="Lithuanian">Lietuvių kalba</option>
        <option value="Hungarian">Magyar</option>
        <option value="Malagasy">Malagasy</option>
        <option value="Maltese">Malti</option>
        <option value="Maori">Māori</option>
        <option value="Dutch">Nederlands</option>
        <option value="Norwegian">Norsk</option>
        <option value="Uzbek">O'zbek tili</option>
        <option value="Polish">Polski</option>
        <option value="Portuguese">Português</option>
        <option value="Romanian">Română</option>
        <option value="Sesotho">Sesotho</option>
        <option value="Albanian">Shqip</option>
        <option value="Slovak">Slovenčina</option>
        <option value="Slovenian">Slovenščina</option>
        <option value="Finnish">Suomi</option>
        <option value="Swedish">Svenska</option>
        <option value="Tagalog">Tagalog</option>
        <option value="Tatar">Tatarça</option>
        <option value="Turkish">Türkçe</option>
        <option value="Vietnamese">Tiếng Việt</option>
        <option value="Yoruba">Yorùbá</option>
        <option value="Greek">Ελληνικά</option>
        <option value="Belarusian">Беларуская мова</option>
        <option value="Bulgarian">Български език</option>
        <option value="Kyrgyz">Кыр</option>
        <option value="Kazakh">Қазақ тілі</option>
        <option value="Macedonian">Македонски јазик</option>
        <option value="Mongolian">Монгол хэл</option>
        <option value="Russian">Русский</option>
        <option value="Serbian">Српски језик</option>
        <option value="Tajik">Тоҷикӣ</option>
        <option value="Ukrainian">Українська</option>
        <option value="Georgian">ქართული</option>
        <option value="Armenian">Հայերեն</option>
        <option value="Yiddish">ייִדיש</option>
        <option value="Hebrew">עברית</option>
        <option value="Uyghur">ئۇيغۇرچە</option>
        <option value="Urdu">اردو</option>
        <option value="Arabic">العربية</option>
        <option value="Pashto">پښتو</option>
        <option value="Persian">فارسی</option>
        <option value="Nepali">नेपाली</option>
        <option value="Marathi">मराठी</option>
        <option value="Hindi">हिन्दी</option>
        <option value="Bengali">বাংলা</option>
        <option value="Punjabi">ਪੰਜਾਬੀ</option>
        <option value="Gujarati">ગુજરાતી</option>
        <option value="Oriya">ଓଡ଼ିଆ</option>
        <option value="Tamil">தமிழ்</option>
        <option value="Telugu">తెలుగు</option>
        <option value="Kannada">ಕನ್ನಡ</option>
        <option value="Malayalam">മലയാളം</option>
        <option value="Sinhala">සිංහල</option>
        <option value="Thai">ไทย</option>
        <option value="Lao">ພາສາລາວ</option>
        <option value="Burmese">ဗမာစာ</option>
        <option value="Khmer">ភាសាខ្មែរ</option>
        <option value="Korean">한국어</option>
        <option value="Chinese">中文</option>
        <option value="Traditional Chinese">繁體中文</option>
        <option value="Japanese">日本語</option>
      </Select>
      <Select {...selectProps('tone', 'Tone')}>
        <option value="Authoritative">Authoritative</option>
        <option value="Clinical">Clinical</option>
        <option value="Cold">Cold</option>
        <option value="Confident">Confident</option>
        <option value="Cynical">Cynical</option>
        <option value="Emotional">Emotional</option>
        <option value="Empathetic">Empathetic</option>
        <option value="Formal">Formal</option>
        <option value="Friendly">Friendly</option>
        <option value="Humorous">Humorous</option>
        <option value="Informal">Informal</option>
        <option value="Ironic">Ironic</option>
        <option value="Optimistic">Optimistic</option>
        <option value="Pessimistic">Pessimistic</option>
        <option value="Playful">Playful</option>
        <option value="Sarcastic">Sarcastic</option>
        <option value="Serious">Serious</option>
        <option value="Sympathetic">Sympathetic</option>
        <option value="Tentative">Tentative</option>
        <option value="Warm">Warm</option>
      </Select>
      <Select {...selectProps('writingStyle', 'Writing Style')}>
        <option value="Academic">Academic</option>
        <option value="Analytical">Analytical</option>
        <option value="Argumentative">Argumentative</option>
        <option value="Conversational">Conversational</option>
        <option value="Creative">Creative</option>
        <option value="Critical">Critical</option>
        <option value="Descriptive">Descriptive</option>
        <option value="Epigrammatic">Epigrammatic</option>
        <option value="Epistolary">Epistolary</option>
        <option value="Expository">Expository</option>
        <option value="Informative">Informative</option>
        <option value="Instructive">Instructive</option>
        <option value="Journalistic">Journalistic</option>
        <option value="Metaphorical">Metaphorical</option>
        <option value="Narrative">Narrative</option>
        <option value="Persuasive">Persuasive</option>
        <option value="Poetic">Poetic</option>
        <option value="Satirical">Satirical</option>
        <option value="Technical">Technical</option>
      </Select>
      <Select {...selectProps('format', 'Format')}>
        <option value="Answer as concise as possible">Concise</option>
        <option value="Think step-by-step">Step-by-step</option>
        <option value="Answer in painstakingly detail">Extreme Detail</option>
        <option value="Explain like I'm five">ELI5</option>
        <option value="Answer in Essay format">Essay</option>
        <option value="Answer in Report format">Report</option>
        <option value="Answer in Summary format">Summary</option>
        <option value="Answer in Table format">Table</option>
        <option value="Answer in FAQ format">FAQ</option>
        <option value="Answer in Listicle format">Listicle</option>
        <option value="Answer in Interview format">Interview</option>
        <option value="Answer in Review format">Review</option>
        <option value="Answer in News format">News</option>
        <option value="Answer in Opinion format">Opinion</option>
        <option value="Answer in Tutorial format">Tutorial</option>
        <option value="Answer in Case Study format">Case Study</option>
        <option value="Answer in Profile format">Profile</option>
        <option value="Answer in Blog format">Blog</option>
        <option value="Answer in Poem format">Poem</option>
        <option value="Answer in Script format">Script</option>
        <option value="Answer in Whitepaper format">Whitepaper</option>
        <option value="Answer in eBook format">eBook</option>
        <option value="Answer in Press Release format">Press Release</option>
        <option value="Answer in Infographic format">Infographic</option>
        <option value="Answer in Webinar format">Webinar</option>
        <option value="Answer in Podcast Script format">Podcast Script</option>
        <option value="Answer in Email Campaign format">Email Campaign</option>
        <option value="Answer in Social Media Post format">
          Social Media Post
        </option>
        <option value="Answer in Proposal format">Proposal</option>
        <option value="Answer in Brochure format">Brochure</option>
        <option value="Answer in Newsletter format">Newsletter</option>
        <option value="Answer in Presentation format">Presentation</option>
        <option value="Answer in Product Description format">
          Product Description
        </option>
        <option value="Answer in Research Paper format">Research Paper</option>
        <option value="Answer in Speech format">Speech</option>
        <option value="Answer in Memo format">Memo</option>
        <option value="Answer in Policy Document format">
          Policy Document
        </option>
        <option value="Answer in User Guide format">User Guide</option>
        <option value="Answer in Technical Documentation format">
          Technical Documentation
        </option>
        <option value="Answer in Q&amp;A format">Q&amp;A</option>
      </Select>
      {!!activeRulesCount && (
        <IconButton
          icon={<TbX />}
          aria-label="Clear rules"
          size="sm"
          borderRadius="xl"
          onClick={handleClear}
        />
      )}
    </HStack>
  );
};

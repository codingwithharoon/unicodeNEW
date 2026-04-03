# Bangla Likhi - Bengali Text Converter

A robust Bengali text conversion library for converting between Unicode and Bijoy keyboard layouts, with support for numbers, symbols, and joined characters.

## Installation

To install the package, use the following command:

```bash
npm install bangla-likhi
```

## Usage

```javascript
import { UnicodeToBijoy, BijoyToUnicode } from 'bangla-likhi';

// Convert Unicode (Avro) to Bijoy
const bijoyText = UnicodeToBijoy('আমি বাংলায় গান গাই'); 

// Convert Bijoy to Unicode
const unicodeText = BijoyToUnicode('Avwg evsjvq MvB');
```

## Key Features

- ᱩᱭᱩᱝᱩᱭᱩᱝ Unicode ↔ Bijoy conversion with full accuracy
- Automatic handling of:
  - Composite characters and vowel signs
  - Bengali numerals and symbols
  - Special joined characters (যুক্তাক্ষর)
- Comprehensive support for both modern and legacy Bijoy layouts
- TypeScript support included

## Documentation

Full documentation and character mapping details available at:  
[docs](./docs)

## Contributing

Please follow standard GitHub workflow. Report issues for:
- Character mapping discrepancies
- Conversion edge cases
- Performance improvements

## License
MIT © [Bangla Likhi Team](https://banglalikhi.com)

## Contact
Email: [hello@banglalikhi.com](mailto:hello@banglalikhi.com)

Thank you for using our package!

# Multilingual Name Management Pattern

## Overview

This document describes the implementation pattern for handling multilingual names in the Fala application, specifically supporting Kannada and English scripts.

## Pattern Design

### Database Schema

We use a **dual-field approach** with automatic language detection:

```sql
-- User profile table with multilingual name support
ALTER TABLE user_profile ADD COLUMN
  first_name_kn TEXT,           -- Kannada first name
  last_name_kn TEXT,            -- Kannada last name
  first_name_en TEXT,           -- English first name
  last_name_en TEXT,            -- English last name
  primary_name_language TEXT;   -- User's primary name language
```

### Key Features

1. **Automatic Script Detection**: Uses Unicode ranges to detect Kannada (`[ಅ-ಹ]`) vs English (`[a-zA-Z]`) scripts
2. **Language-Specific Storage**: Names stored in appropriate language fields based on script detection
3. **Fallback Support**: Maintains backward compatibility with existing `first_name`/`last_name` fields
4. **Display Intelligence**: Shows names in user's preferred UI language when available

### Implementation Components

#### 1. Language Utilities (`/src/utils/language-utils.ts`)

- `isKannadaText()`: Detects Kannada script using Unicode ranges
- `detectLanguage()`: Determines primary language of input text
- `processNameInput()`: Processes name input and determines storage strategy
- `formatDisplayName()`: Formats names for display with titles and cultural conventions

#### 2. Farmer Context (`/src/lib/farmer-context.tsx`)

- `updateName()`: Smart name update with automatic language detection
- `updateTitle()`: Updates user title (ಶ್ರೀ/ಶ್ರೀಮತಿ or Mr./Mrs.)
- `getDisplayName()`: Returns properly formatted name in requested language

#### 3. UI Components (`/src/app/(protected)/profile/farmer-profile-card.tsx`)

- Language-aware editing interface
- Real-time script detection feedback
- Context-sensitive placeholders

## Best Practices

### Industry Standards

This pattern follows practices used by companies like:

- **Google**: Separate storage by script/language
- **Facebook**: Original script preservation with transliteration services
- **WhatsApp**: Language metadata with name data

### Data Storage Strategy

1. **Always preserve original user input** in the appropriate language field
2. **Use script detection** to automatically categorize names
3. **Maintain backward compatibility** with existing single-language fields
4. **Store language metadata** to understand user's primary name language

### Display Logic

1. **Prefer user's UI language** for name display when available
2. **Fallback to primary name language** when UI language not available
3. **Apply cultural formatting** (titles, respect suffixes) based on display language

## Usage Examples

### Registering a new user with Kannada name:

```typescript
// Input: firstName = "ಶಂಕರಪ್ಪ", lastName = "ಎನ್"
// Result:
{
  firstName: "ಶಂಕರಪ್ಪ",        // backward compatibility
  lastName: "ಎನ್",             // backward compatibility
  firstNameKn: "ಶಂಕರಪ್ಪ",      // Kannada storage
  lastNameKn: "ಎನ್",           // Kannada storage
  firstNameEn: null,           // No English version
  lastNameEn: null,            // No English version
  primaryNameLanguage: "kn"    // Detected as Kannada
}
```

### Registering a new user with English name:

```typescript
// Input: firstName = "John", lastName = "Doe"
// Result:
{
  firstName: "John",           // backward compatibility
  lastName: "Doe",             // backward compatibility
  firstNameKn: null,           // No Kannada version
  lastNameKn: null,            // No Kannada version
  firstNameEn: "John",         // English storage
  lastNameEn: "Doe",           // English storage
  primaryNameLanguage: "en"    // Detected as English
}
```

### Displaying names:

```typescript
// User has Kannada name, viewing in Kannada UI
getDisplayName("kn"); // "ಶ್ರೀ ಶಂಕರಪ್ಪ ಎನ್ ರವರೆ"

// User has Kannada name, viewing in English UI
getDisplayName("en"); // "Mr. ಶಂಕರಪ್ಪ ಎನ್" (preserves original script)
```

## Migration Strategy

1. **Add new columns** to existing user_profile table
2. **Migrate existing data** using script detection
3. **Update application code** to use new multilingual functions
4. **Maintain backward compatibility** during transition period
5. **Gradually phase out** old single-language fields

## Database Functions

### `get_display_name(profile_row, display_language)`

Server-side function to format names for display in SQL queries.

### `handle_new_user()`

Updated trigger function that automatically detects and stores names in appropriate language fields during user registration.

## Benefits

1. **Cultural Sensitivity**: Proper handling of Kannada names and titles
2. **User Experience**: Names display correctly in user's preferred language
3. **Data Integrity**: Original user input preserved exactly as entered
4. **Scalability**: Pattern easily extends to additional languages
5. **Performance**: Efficient querying with language-specific indexes
6. **Internationalization**: Supports global expansion with minimal changes

## Future Enhancements

1. **Transliteration Services**: Add automatic transliteration between scripts
2. **Voice Input**: Support voice-to-text in native languages
3. **Additional Languages**: Extend to Tamil, Telugu, Malayalam support
4. **Name Variants**: Support multiple name variants per user
5. **Cultural Calendars**: Integrate with regional calendar systems

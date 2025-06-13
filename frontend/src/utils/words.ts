const PICTIONARY_WORDS = [
  // Animals
  'cat', 'dog', 'elephant', 'giraffe', 'penguin', 'butterfly', 'shark', 'turtle',
  'rabbit', 'lion', 'tiger', 'bear', 'whale', 'dolphin', 'owl', 'eagle',
  
  // Objects
  'car', 'bicycle', 'airplane', 'boat', 'house', 'tree', 'flower', 'sun',
  'moon', 'star', 'book', 'computer', 'phone', 'chair', 'table', 'lamp',
  
  // Food
  'pizza', 'hamburger', 'apple', 'banana', 'ice cream', 'cake', 'coffee', 'bread',
  'cheese', 'fish', 'chicken', 'carrot', 'tomato', 'potato', 'cookie', 'sandwich',
  
  // Actions
  'running', 'jumping', 'swimming', 'dancing', 'singing', 'sleeping', 'reading', 'writing',
  'cooking', 'driving', 'flying', 'climbing', 'walking', 'sitting', 'standing', 'laughing',
  
  // Sports & Activities
  'football', 'basketball', 'tennis', 'golf', 'baseball', 'soccer', 'hockey', 'skiing',
  'painting', 'music', 'guitar', 'piano', 'camera', 'movie', 'television', 'game',
  
  // Nature
  'mountain', 'ocean', 'forest', 'desert', 'rainbow', 'cloud', 'rain', 'snow',
  'fire', 'wind', 'earth', 'water', 'grass', 'leaf', 'rock', 'sand',
  
  // Emotions & Concepts
  'happy', 'sad', 'angry', 'surprised', 'scared', 'excited', 'tired', 'confused',
  'love', 'friendship', 'family', 'birthday', 'party', 'celebration', 'gift', 'holiday'
];

export function getRandomWord(): string {
  const randomIndex = Math.floor(Math.random() * PICTIONARY_WORDS.length);
  return PICTIONARY_WORDS[randomIndex];
}

export function getWordList(): string[] {
  return [...PICTIONARY_WORDS];
} 
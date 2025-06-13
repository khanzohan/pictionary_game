import random
from typing import List

PICTIONARY_WORDS = [
    # Animals
    'cat', 'dog', 'elephant', 'giraffe', 'penguin', 'butterfly', 'shark', 'turtle',
    'rabbit', 'lion', 'tiger', 'bear', 'whale', 'dolphin', 'owl', 'eagle',
    
    # Objects
    'car', 'bicycle', 'airplane', 'boat', 'house', 'tree', 'flower', 'sun',
    'moon', 'star', 'book', 'computer', 'phone', 'chair', 'table', 'lamp',
    
    # Food
    'pizza', 'hamburger', 'apple', 'banana', 'ice cream', 'cake', 'coffee', 'bread',
    'cheese', 'fish', 'chicken', 'carrot', 'tomato', 'potato', 'cookie', 'sandwich',
    
    # Actions
    'running', 'jumping', 'swimming', 'dancing', 'singing', 'sleeping', 'reading', 'writing',
    'cooking', 'driving', 'flying', 'climbing', 'walking', 'sitting', 'standing', 'laughing',
    
    # Sports & Activities
    'football', 'basketball', 'tennis', 'golf', 'baseball', 'soccer', 'hockey', 'skiing',
    'painting', 'music', 'guitar', 'piano', 'camera', 'movie', 'television', 'game',
    
    # Nature
    'mountain', 'ocean', 'forest', 'desert', 'rainbow', 'cloud', 'rain', 'snow',
    'fire', 'wind', 'earth', 'water', 'grass', 'leaf', 'rock', 'sand',
    
    # Emotions & Concepts
    'happy', 'sad', 'angry', 'surprised', 'scared', 'excited', 'tired', 'confused',
    'love', 'friendship', 'family', 'birthday', 'party', 'celebration', 'gift', 'holiday'
]

def get_random_word() -> str:
    """Get a random word from the Pictionary word bank"""
    return random.choice(PICTIONARY_WORDS)

def get_word_list() -> List[str]:
    """Get the complete list of Pictionary words"""
    return PICTIONARY_WORDS.copy()

def get_words_by_category() -> dict:
    """Get words organized by category"""
    return {
        "animals": [
            'cat', 'dog', 'elephant', 'giraffe', 'penguin', 'butterfly', 'shark', 'turtle',
            'rabbit', 'lion', 'tiger', 'bear', 'whale', 'dolphin', 'owl', 'eagle'
        ],
        "objects": [
            'car', 'bicycle', 'airplane', 'boat', 'house', 'tree', 'flower', 'sun',
            'moon', 'star', 'book', 'computer', 'phone', 'chair', 'table', 'lamp'
        ],
        "food": [
            'pizza', 'hamburger', 'apple', 'banana', 'ice cream', 'cake', 'coffee', 'bread',
            'cheese', 'fish', 'chicken', 'carrot', 'tomato', 'potato', 'cookie', 'sandwich'
        ],
        "actions": [
            'running', 'jumping', 'swimming', 'dancing', 'singing', 'sleeping', 'reading', 'writing',
            'cooking', 'driving', 'flying', 'climbing', 'walking', 'sitting', 'standing', 'laughing'
        ],
        "sports": [
            'football', 'basketball', 'tennis', 'golf', 'baseball', 'soccer', 'hockey', 'skiing',
            'painting', 'music', 'guitar', 'piano', 'camera', 'movie', 'television', 'game'
        ],
        "nature": [
            'mountain', 'ocean', 'forest', 'desert', 'rainbow', 'cloud', 'rain', 'snow',
            'fire', 'wind', 'earth', 'water', 'grass', 'leaf', 'rock', 'sand'
        ],
        "emotions": [
            'happy', 'sad', 'angry', 'surprised', 'scared', 'excited', 'tired', 'confused',
            'love', 'friendship', 'family', 'birthday', 'party', 'celebration', 'gift', 'holiday'
        ]
    }

def get_random_word_by_category(category: str) -> str:
    """Get a random word from a specific category"""
    categories = get_words_by_category()
    if category in categories:
        return random.choice(categories[category])
    return get_random_word()  # Fallback to any random word

def is_valid_word(word: str) -> bool:
    """Check if a word is in the Pictionary word bank"""
    return word.lower() in [w.lower() for w in PICTIONARY_WORDS] 
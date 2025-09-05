#!/usr/bin/env python3
"""
Script to convert existing webinar content to content blocks
"""

import os
import sys
import json
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models import ContentBlock, Base

# Add the current directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

def convert_webinar_to_blocks():
    """Convert existing webinar content to content blocks"""
    
    # Database setup
    DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./data/newday_platform.db")
    engine = create_engine(DATABASE_URL)
    Base.metadata.create_all(engine)
    Session = sessionmaker(bind=engine)
    session = Session()
    
    try:
        # Check if blocks already exist
        existing_blocks = session.query(ContentBlock).count()
        if existing_blocks > 0:
            print("Content blocks already exist in database. Skipping conversion.")
            return
        
        # Create content blocks from webinar content
        # Block 1: Water and Morning Routine
        water_block = ContentBlock(
            name="Water and Morning Routine",
            category="hydration",
            description="Morning hydration and routine exercises",
            content_type="morning_routine",
            content_data=json.dumps({
                "affirmation": "I am hydrated and ready for the day",
                "nutrition_fact": {
                    "title": "Why drinking water in the morning saves from anxiety?",
                    "content": "Drinking water first thing in the morning helps regulate cortisol levels and rehydrate your body after sleep. This simple act can reduce morning anxiety by up to 30%."
                },
                "exercise": "Joint gymnastics 3-5 min",
                "questions": [
                    "What am I feeling right now as I begin this journey?",
                    "Where in my body do I feel tension this morning?",
                    "What would support me most today?"
                ]
            })
        )
        session.add(water_block)
        
        # Block 2: Protein-Powered Mornings
        protein_block = ContentBlock(
            name="Protein-Powered Mornings",
            category="nutrition",
            description="Protein-rich breakfast for stress management",
            content_type="nutrition",
            content_data=json.dumps({
                "affirmation": "I fuel my body and mind with nourishing choices",
                "nutrition_fact": {
                    "title": "Why a protein breakfast is anti-stress?",
                    "content": "A protein-rich breakfast stabilizes blood sugar and supports neurotransmitter production, helping you stay calm and focused throughout the morning."
                },
                "exercise": "Cat-dog stretch sequence",
                "questions": [
                    "How does my energy level feel this morning?",
                    "What would I like to accomplish today?",
                    "How can I be kinder to myself today?"
                ]
            })
        )
        session.add(protein_block)
        
        # Block 3: Emotional Awareness
        emotional_block = ContentBlock(
            name="Emotional Awareness",
            category="mindfulness",
            description="Developing emotional awareness skills",
            content_type="mindfulness",
            content_data=json.dumps({
                "affirmation": "I am aware of my feelings and I allow them to be",
                "nutrition_fact": {
                    "title": "Emotional awareness and stress eating",
                    "content": "Emotional awareness helps prevent stress eating by helping you distinguish between physical hunger and emotional needs."
                },
                "exercise": "Close eyes → imagine yourself → then approach mirror",
                "questions": [
                    "What emotions have I experienced today?",
                    "Where do I feel these emotions in my body?",
                    "How have I responded to challenges today?"
                ]
            })
        )
        session.add(emotional_block)
        
        # Block 4: Carbohydrates - Friend or Foe?
        carbs_block = ContentBlock(
            name="Carbohydrates - Friend or Foe?",
            category="nutrition",
            description="Understanding how carbs affect mood",
            content_type="nutrition",
            content_data=json.dumps({
                "affirmation": "I make food choices that support my well-being",
                "nutrition_fact": {
                    "title": "Carbohydrates: enemies or allies?",
                    "content": "Complex carbohydrates support serotonin production, promoting feelings of calm and well-being, while simple carbs can cause energy crashes and mood swings."
                },
                "exercise": "Arms up and down stretch with breathing",
                "questions": [
                    "What food choices have I made today?",
                    "How did these choices affect my energy and mood?",
                    "What would nourish me most right now?"
                ]
            })
        )
        session.add(carbs_block)
        
        # Block 5: Movement and Energy
        movement_block = ContentBlock(
            name="Movement and Energy",
            category="exercise",
            description="Physical movement for stress relief",
            content_type="exercise",
            content_data=json.dumps({
                "affirmation": "Movement brings me vitality and peace",
                "nutrition_fact": {
                    "title": "Physical movement for stress relief",
                    "content": "Physical movement releases endorphins, natural mood elevators that reduce stress hormones like cortisol and adrenaline."
                },
                "exercise": "Neck turns and shoulder rolls",
                "questions": [
                    "How does my body feel today compared to when we started?",
                    "What movement would energize me right now?",
                    "How can I incorporate more movement into my day?"
                ]
            })
        )
        session.add(movement_block)
        
        # Block 6: Mindful Eating
        mindful_eating_block = ContentBlock(
            name="Mindful Eating",
            category="mindfulness",
            description="Practicing mindful eating techniques",
            content_type="mindfulness",
            content_data=json.dumps({
                "affirmation": "I eat with awareness and gratitude",
                "nutrition_fact": {
                    "title": "Mindful eating benefits",
                    "content": "Mindful eating - paying attention to taste, texture, and satisfaction - can reduce overeating by up to 25% and improve digestion."
                },
                "exercise": "Meditation 'Observing breath' 3 min",
                "questions": [
                    "Am I eating because I'm hungry or for another reason?",
                    "How does my food make me feel physically and emotionally?",
                    "What would support me in eating more mindfully?"
                ]
            })
        )
        session.add(mindful_eating_block)
        
        # Block 7: Recognizing Stress Eating
        stress_eating_block = ContentBlock(
            name="Recognizing Stress Eating",
            category="mindfulness",
            description="Identifying stress eating patterns",
            content_type="mindfulness",
            content_data=json.dumps({
                "affirmation": "I recognize my stress patterns and respond with care",
                "nutrition_fact": {
                    "title": "What does 'stress eating' mean?",
                    "content": "Stress eating often occurs when we use food to cope with emotions rather than satisfy hunger. Recognizing this pattern is the first step toward change."
                },
                "exercise": "I'm tired, but also... - complete this sentence and do a gentle stretch",
                "questions": [
                    "When have I eaten today for reasons other than hunger?",
                    "What emotions triggered these eating moments?",
                    "What other ways could I comfort myself in those moments?"
                ]
            })
        )
        session.add(stress_eating_block)
        
        # Block 8: Evening Nourishment
        evening_block = ContentBlock(
            name="Evening Nourishment",
            category="relaxation",
            description="Creating peaceful evening routines",
            content_type="relaxation",
            content_data=json.dumps({
                "affirmation": "I create peace and calm in my evening routine",
                "nutrition_fact": {
                    "title": "Evening nutrition for better sleep",
                    "content": "Eating light, easily digestible foods in the evening supports better sleep and reduces nighttime anxiety. Heavy meals can disrupt sleep patterns."
                },
                "exercise": "Gratitude practice - '3 things I can be grateful for today'",
                "questions": [
                    "What would help me wind down more effectively in the evenings?",
                    "How can I create a more peaceful bedtime routine?",
                    "What evening habits would support better sleep?"
                ]
            })
        )
        session.add(evening_block)
        
        # Block 9: Sleep and Nighttime Anxiety
        sleep_block = ContentBlock(
            name="Sleep and Nighttime Anxiety",
            category="relaxation",
            description="Foods and practices for better sleep",
            content_type="relaxation",
            content_data=json.dumps({
                "affirmation": "I honor my body's need for restorative sleep",
                "nutrition_fact": {
                    "title": "What to eat for better sleep",
                    "content": "Foods rich in magnesium (like nuts and leafy greens) and tryptophan (like turkey and dairy) can promote relaxation and better sleep by supporting melatonin production."
                },
                "exercise": "Visual task - Draw how you feel right now",
                "questions": [
                    "What factors contribute to my sleep quality?",
                    "How do I feel when I wake up naturally vs. with an alarm?",
                    "What bedtime rituals would support deeper sleep?"
                ]
            })
        )
        session.add(sleep_block)
        
        # Block 10: Integration and Next Steps
        integration_block = ContentBlock(
            name="Integration and Next Steps",
            category="reflection",
            description="Completing the journey and planning next steps",
            content_type="reflection",
            content_data=json.dumps({
                "affirmation": "I have grown and I am ready for more",
                "nutrition_fact": {
                    "title": "Completing your 10-day journey",
                    "content": "You've completed a powerful 10-day journey of self-discovery. The habits you've started can continue to support your well-being for life."
                },
                "exercise": "Full body stretch with intention setting",
                "questions": [
                    "What have I learned about myself during these 10 days?",
                    "Which practices would I like to continue?",
                    "How do I want to continue growing?"
                ]
            })
        )
        session.add(integration_block)
        
        # Additional blocks for flexibility
        breathing_block = ContentBlock(
            name="Breathing Exercises",
            category="breathing",
            description="Various breathing techniques for stress relief",
            content_type="exercise",
            content_data=json.dumps({
                "exercises": [
                    {
                        "name": "Deep Belly Breathing",
                        "description": "Breathe deeply into your belly for 5 minutes",
                        "duration": "5 minutes"
                    },
                    {
                        "name": "4-7-8 Breathing",
                        "description": "Inhale for 4, hold for 7, exhale for 8",
                        "duration": "3 minutes"
                    },
                    {
                        "name": "Box Breathing",
                        "description": "Inhale, hold, exhale, hold for equal counts",
                        "duration": "4 minutes"
                    }
                ]
            })
        )
        session.add(breathing_block)
        
        lfk_block = ContentBlock(
            name="Gentle Physical Exercises",
            category="exercise",
            description="Light physical exercises for daily practice",
            content_type="exercise",
            content_data=json.dumps({
                "exercises": [
                    {
                        "name": "Neck Stretches",
                        "description": "Gentle neck rotations and stretches",
                        "duration": "2 minutes"
                    },
                    {
                        "name": "Shoulder Rolls",
                        "description": "Forward and backward shoulder rolls",
                        "duration": "1 minute"
                    },
                    {
                        "name": "Spinal Twist",
                        "description": "Seated spinal twists for flexibility",
                        "duration": "3 minutes"
                    }
                ]
            })
        )
        session.add(lfk_block)
        
        meditation_block = ContentBlock(
            name="Meditation Practices",
            category="mindfulness",
            description="Various meditation techniques",
            content_type="mindfulness",
            content_data=json.dumps({
                "meditations": [
                    {
                        "name": "Mindfulness Meditation",
                        "description": "Focus on present moment awareness",
                        "duration": "10 minutes"
                    },
                    {
                        "name": "Body Scan",
                        "description": "Progressive relaxation through body awareness",
                        "duration": "15 minutes"
                    },
                    {
                        "name": "Loving-Kindness",
                        "description": "Cultivating compassion for self and others",
                        "duration": "12 minutes"
                    }
                ]
            })
        )
        session.add(meditation_block)
        
        # Commit all changes
        session.commit()
        print("Successfully converted webinar content to content blocks!")
        print(f"Created {session.query(ContentBlock).count()} content blocks.")
        
    except Exception as e:
        print(f"Error converting webinar to blocks: {e}")
        session.rollback()
    finally:
        session.close()

if __name__ == "__main__":
    convert_webinar_to_blocks()
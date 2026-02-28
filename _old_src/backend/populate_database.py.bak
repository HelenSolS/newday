#!/usr/bin/env python3
"""
Database Population Script for NewDay Platform Webinar Lead Magnet

This script populates the database with the 10-day webinar content based on
the detailed structure defined in WEBINAR_CONTENT_STRUCTURE.md
"""

import os
import sys
import json
from datetime import datetime, timedelta
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Add the app directory to the path
sys.path.append(os.path.join(os.path.dirname(__file__), 'app'))

# Import models from models.py
from models import Base, Webinar, WebinarDay, Participant, Response, VisualTest

def populate_webinar_content():
    """Populate the database with the 10-day webinar content"""
    
    # Database setup
    DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./data/newday_platform.db")
    engine = create_engine(DATABASE_URL)
    Base.metadata.create_all(engine)
    Session = sessionmaker(bind=engine)
    session = Session()
    
    try:
        # Check if webinar already exists
        existing_webinar = session.query(Webinar).filter_by(title="10-Day Anti-Stress Journey").first()
        if existing_webinar:
            print("Webinar already exists in database. Skipping population.")
            return
        
        # Create the main webinar
        start_date = datetime.utcnow()
        end_date = start_date + timedelta(days=10)
        
        webinar = Webinar(
            title="10-Day Anti-Stress Journey",
            description="A comprehensive 10-day journey to help you understand and manage stress through nutrition, self-awareness, and practical exercises.",
            duration_days=10,
            start_date=start_date,
            end_date=end_date
        )
        
        session.add(webinar)
        session.commit()
        session.refresh(webinar)
        
        print(f"Created webinar: {webinar.title}")
        
        # Day 1: Water and Morning Routine
        day1_content = {
            "morning": {
                "greeting": "Good morning! Ready to start your journey to less stress?",
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
            },
            "evening": {
                "summary_question": "How did staying hydrated today affect your energy and mood?",
                "gratitude_affirmation": "I am taking the first step toward a calmer me",
                "progress_summary": "Day 1 complete: You've learned about morning hydration and started observing your body's signals"
            }
        }
        
        day1_questions = [
            "What am I feeling right now as I begin this journey?",
            "Where in my body do I feel tension this morning?",
            "What would support me most today?",
            "How do you usually start your morning? Rush or with intention?"
        ]
        
        day1_visual_test = {
            "image_description": "Image showing order/mess/dirt",
            "question": "What does this remind you of in your morning routine?",
            "options": ["Orderly routine", "Chaotic start", "Peaceful beginning", "Rushed preparation"]
        }
        
        day1 = WebinarDay(
            webinar_id=webinar.id,
            day_number=1,
            title="Water and Morning Routine",
            content=json.dumps(day1_content),
            questions=json.dumps(day1_questions),
            visual_test_data=json.dumps(day1_visual_test)
        )
        
        session.add(day1)
        
        # Day 2: Protein-Powered Mornings
        day2_content = {
            "morning": {
                "greeting": "Day 2! How are you feeling today compared to yesterday?",
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
            },
            "evening": {
                "summary_question": "Did you notice any difference in your morning energy after focusing on protein?",
                "gratitude_affirmation": "I am learning to nourish myself with intention",
                "progress_summary": "Day 2 complete: You've discovered how breakfast choices impact stress levels"
            }
        }
        
        day2_questions = [
            "How does my energy level feel this morning?",
            "What would I like to accomplish today?",
            "How can I be kinder to myself today?",
            "What does a typical breakfast look like for you? How does it make you feel?"
        ]
        
        day2_visual_test = {
            "image_description": "Image of different breakfast options",
            "question": "Which would give you sustained energy?",
            "options": ["High protein meal", "High carb meal", "Balanced breakfast", "Light snack"]
        }
        
        day2 = WebinarDay(
            webinar_id=webinar.id,
            day_number=2,
            title="Protein-Powered Mornings",
            content=json.dumps(day2_content),
            questions=json.dumps(day2_questions),
            visual_test_data=json.dumps(day2_visual_test)
        )
        
        session.add(day2)
        
        # Day 3: Emotional Awareness
        day3_content = {
            "morning": {
                "greeting": "Day 3 - How are you feeling today?",
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
            },
            "evening": {
                "summary_question": "What did you learn about your emotional patterns today?",
                "gratitude_affirmation": "I am becoming more aware of my inner world",
                "progress_summary": "Day 3 complete: You've developed emotional awareness skills"
            }
        }
        
        day3_questions = [
            "What emotions have I experienced today?",
            "Where do I feel these emotions in my body?",
            "How have I responded to challenges today?",
            "What emotions have you noticed in yourself today?"
        ]
        
        day3_visual_test = {
            "image_description": "Image of a street kitten",
            "question": "What emotion does this image evoke in you?",
            "options": ["Playfulness", "Vulnerability", "Curiosity", "Independence"]
        }
        
        day3 = WebinarDay(
            webinar_id=webinar.id,
            day_number=3,
            title="Emotional Awareness",
            content=json.dumps(day3_content),
            questions=json.dumps(day3_questions),
            visual_test_data=json.dumps(day3_visual_test)
        )
        
        session.add(day3)
        
        # Day 4: Carbohydrates - Friend or Foe?
        day4_content = {
            "morning": {
                "greeting": "Day 4 - Building on your awareness",
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
            },
            "evening": {
                "summary_question": "How did your understanding of carbs change your food choices today?",
                "gratitude_affirmation": "I am learning to make food choices that support my mental health",
                "progress_summary": "Day 4 complete: You've gained insight into how carbs affect your mood"
            }
        }
        
        day4_questions = [
            "What food choices have I made today?",
            "How did these choices affect my energy and mood?",
            "What would nourish me most right now?",
            "When do you typically crave carbohydrates? What triggers these cravings?"
        ]
        
        day4_visual_test = {
            "image_description": "Image of food choices (healthy/emotional/celebration)",
            "question": "Which represents your typical carb choice?",
            "options": ["Healthy complex carbs", "Simple sugars", "Emotional eating", "Celebration foods"]
        }
        
        day4 = WebinarDay(
            webinar_id=webinar.id,
            day_number=4,
            title="Carbohydrates - Friend or Foe?",
            content=json.dumps(day4_content),
            questions=json.dumps(day4_questions),
            visual_test_data=json.dumps(day4_visual_test)
        )
        
        session.add(day4)
        
        # Day 5: Movement and Energy
        day5_content = {
            "morning": {
                "greeting": "Day 5 - Mid-week energy boost!",
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
            },
            "evening": {
                "summary_question": "How did movement affect your stress levels today?",
                "gratitude_affirmation": "My body is capable of finding balance and peace",
                "progress_summary": "Day 5 complete: You've experienced the stress-relieving benefits of movement"
            }
        }
        
        day5_questions = [
            "How does my body feel today compared to when we started?",
            "What movement would energize me right now?",
            "How can I incorporate more movement into my day?",
            "What kind of movement feels good to you right now?"
        ]
        
        day5_visual_test = {
            "image_description": "Image of different physical activities",
            "question": "Which would you enjoy most?",
            "options": ["Yoga/stretching", "Walking/outdoor activity", "Dancing", "Strength training"]
        }
        
        day5 = WebinarDay(
            webinar_id=webinar.id,
            day_number=5,
            title="Movement and Energy",
            content=json.dumps(day5_content),
            questions=json.dumps(day5_questions),
            visual_test_data=json.dumps(day5_visual_test)
        )
        
        session.add(day5)
        
        # Day 6: Mindful Eating
        day6_content = {
            "morning": {
                "greeting": "Day 6 - Deepening your practice",
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
            },
            "evening": {
                "summary_question": "What did you notice about your eating patterns today?",
                "gratitude_affirmation": "I am developing a healthier relationship with food",
                "progress_summary": "Day 6 complete: You've practiced mindful eating techniques"
            }
        }
        
        day6_questions = [
            "Am I eating because I'm hungry or for another reason?",
            "How does my food make me feel physically and emotionally?",
            "What would support me in eating more mindfully?",
            "What does 'eating mindfully' mean to you?"
        ]
        
        day6_visual_test = {
            "image_description": "Image of a table with pies and fruits",
            "question": "Which would help you unwind?",
            "options": ["Fresh fruit", "Rich dessert", "Herbal tea", "Light snack"]
        }
        
        day6 = WebinarDay(
            webinar_id=webinar.id,
            day_number=6,
            title="Mindful Eating",
            content=json.dumps(day6_content),
            questions=json.dumps(day6_questions),
            visual_test_data=json.dumps(day6_visual_test)
        )
        
        session.add(day6)
        
        # Day 7: Recognizing Stress Eating
        day7_content = {
            "morning": {
                "greeting": "Day 7 - Recognizing your patterns",
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
            },
            "evening": {
                "summary_question": "What patterns did you notice in your eating today?",
                "gratitude_affirmation": "I am becoming aware of my habits with compassion",
                "progress_summary": "Day 7 complete: You've identified your stress eating triggers"
            }
        }
        
        day7_questions = [
            "When have I eaten today for reasons other than hunger?",
            "What emotions triggered these eating moments?",
            "What other ways could I comfort myself in those moments?",
            "Can you identify times when you eat for reasons other than hunger?"
        ]
        
        day7_visual_test = {
            "image_description": "Image showing different emotional states",
            "question": "Which resonates with you today?",
            "options": ["Anxious", "Content", "Overwhelmed", "Peaceful"]
        }
        
        day7 = WebinarDay(
            webinar_id=webinar.id,
            day_number=7,
            title="Recognizing Stress Eating",
            content=json.dumps(day7_content),
            questions=json.dumps(day7_questions),
            visual_test_data=json.dumps(day7_visual_test)
        )
        
        session.add(day7)
        
        # Day 8: Evening Nourishment
        day8_content = {
            "morning": {
                "greeting": "Day 8 - Preparing for peaceful evenings",
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
            },
            "evening": {
                "summary_question": "What evening practices felt most calming today?",
                "gratitude_affirmation": "I am creating space for rest and renewal",
                "progress_summary": "Day 8 complete: You've explored evening wellness practices"
            }
        }
        
        day8_questions = [
            "What would help me wind down more effectively in the evenings?",
            "How can I create a more peaceful bedtime routine?",
            "What evening habits would support better sleep?",
            "What does your typical evening routine look like?"
        ]
        
        day8_visual_test = {
            "image_description": "Image of relaxing evening activities",
            "question": "Which would help you unwind?",
            "options": ["Reading", "Meditation", "Warm bath", "Listening to music"]
        }
        
        day8 = WebinarDay(
            webinar_id=webinar.id,
            day_number=8,
            title="Evening Nourishment",
            content=json.dumps(day8_content),
            questions=json.dumps(day8_questions),
            visual_test_data=json.dumps(day8_visual_test)
        )
        
        session.add(day8)
        
        # Day 9: Sleep and Nighttime Anxiety
        day9_content = {
            "morning": {
                "greeting": "Day 9 - Nurturing restful sleep",
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
            },
            "evening": {
                "summary_question": "What evening food choices support your sleep?",
                "gratitude_affirmation": "I am creating the conditions for restful sleep",
                "progress_summary": "Day 9 complete: You've learned about foods that promote better sleep"
            }
        }
        
        day9_questions = [
            "What factors contribute to my sleep quality?",
            "How do I feel when I wake up naturally vs. with an alarm?",
            "What bedtime rituals would support deeper sleep?",
            "How does your eating in the evening affect your sleep quality?"
        ]
        
        day9_visual_test = {
            "image_description": "Image of bedtime snacks",
            "question": "Which would support better sleep?",
            "options": ["Warm milk", "Herbal tea", "Light fruit", "Nuts and seeds"]
        }
        
        day9 = WebinarDay(
            webinar_id=webinar.id,
            day_number=9,
            title="Sleep and Nighttime Anxiety",
            content=json.dumps(day9_content),
            questions=json.dumps(day9_questions),
            visual_test_data=json.dumps(day9_visual_test)
        )
        
        session.add(day9)
        
        # Day 10: Integration and Next Steps
        day10_content = {
            "morning": {
                "greeting": "Final day - Celebrating your journey!",
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
            },
            "evening": {
                "summary_question": "How do you feel different than when you started this journey?",
                "gratitude_affirmation": "I have taken the first step on a transformative path",
                "progress_summary": "Congratulations! You've completed the 10-day anti-stress journey. You've learned to recognize stress patterns, make nourishing food choices, incorporate movement, and develop self-awareness. Ready to go deeper?",
                "transition_message": "Here you began. There - you'll change much more."
            }
        }
        
        day10_questions = [
            "What have I learned about myself during these 10 days?",
            "Which practices would I like to continue?",
            "How do I want to continue growing?",
            "What insights from this journey will you carry forward?"
        ]
        
        day10_visual_test = {
            "image_description": "Image showing growth/progress",
            "question": "How has your journey looked?",
            "options": ["Steady progress", "Ups and downs", "Transformation", "New beginning"]
        }
        
        day10 = WebinarDay(
            webinar_id=webinar.id,
            day_number=10,
            title="Integration and Next Steps",
            content=json.dumps(day10_content),
            questions=json.dumps(day10_questions),
            visual_test_data=json.dumps(day10_visual_test)
        )
        
        session.add(day10)
        
        # Commit all changes
        session.commit()
        print("Successfully populated database with webinar content!")
        print(f"Webinar '{webinar.title}' created with {len(webinar.days)} days of content.")
        
    except Exception as e:
        print(f"Error populating database: {e}")
        session.rollback()
    finally:
        session.close()

if __name__ == "__main__":
    populate_webinar_content()
# Profile: RAHUL V S

## 1. Core Identity & Summary
Rahul V S is a Data Scientist and Generative AI Engineer.
He specializes in low-latency RAG architectures, autonomous multi-agent systems, fine-tuning transformer models, and scalable predictive machine learning.
He is open for AI and Data Science roles, freelance collaborations, and technical projects.


## 2. Academic Background & Degrees
- Degree: Bachelor of Engineering (B.E.) in Computer Science and Engineering from Dhanalakshmi Srinivasan College of Engineering (CGPA: 7.5 / 10).
- Specialization: Currently specializing in Data Science & Applications at the Indian Institute of Technology Madras (IIT Madras / IITM).
- Relevant IITM Coursework: Machine Learning, Deep Learning and Generative AI, Statistics for Data Science, Mathematics for Data Science, Python, and Tools in Data Science.

## 3. Project 1: ABIA (Agentic Business Intelligence Assistant)
- Description: An enterprise-grade, self-healing multi-agent BI system built to eliminate mathematical hallucinations and unsafe dynamic code execution.
- Tech Stack: LangGraph, Groq LPU (Llama-3.3-70B), Pydantic v2, Pandas, Plotly Express, Streamlit, LangSmith, uv.
- Architecture:
  - LLM acts strictly as a Semantic Compiler outputting strongly typed Pydantic QueryPlans (JSON).
  - Pandas executes 100% of arithmetic, grouping, formulas, and table joins deterministically.
  - Features a cyclic self-healing state graph (up to 3 retries on execution errors).
  - Auto-injects relational joins for missing customer and product tables.
  - Uses schema metadata injection (~700 tokens) rather than raw CSV dumps.
- Live App: https://abia-ai.streamlit.app/
- GitHub: https://github.com/rahul-venu/Agentic-Business-Intelligence-Assistant-ABIA

## 4. Project 2: Multi-Label Emotion Classification via RoBERTa
- Description: A fine-tuned RoBERTa transformer for granular multi-label emotion classification across text dialogues.
- Performance: Achieved an 86% macro F1-score on Kaggle.
- Tech Stack: PyTorch, Hugging Face (Transformers, Tokenizers), RoBERTa-base, BCEWithLogitsLoss, Focal Loss, Streamlit Cloud, NumPy, Pandas.
- Technical Innovations:
  - Addressed severe minority-class imbalance (<5% representation) through targeted paraphrasing data augmentation and regex text cleaning.
  - Decoupled architecture: model weights are hosted on Hugging Face Hub (rahul-venu/Emotion-detect) and streamed at runtime into Streamlit.
- Live App: https://text-emotion-finder.streamlit.app/
- GitHub: https://github.com/rahul-venu/roberta-emotion-detection-iitm

## 5. Project 3: Purchase Value Prediction from Multi-Session Behavior
- Description: End-to-end tabular regression pipeline predicting customer purchase value from high-dimensional multi-session user telemetry.
- Performance: Validation R² score improved by ~12%.
- Tech Stack: Scikit-learn, Random Forest Regressor, LightGBM, XGBoost, PCA, Pandas, NumPy, Kaggle Notebooks.
- Technical Innovations:
  - Overcame an extreme zero-inflation anomaly (~80% of users had 0 purchase value) using log1p target transformation and inverse exponential inference.
  - Aggregated raw session telemetry into user-level behavioral features.
  - Applied target encoding for high-cardinality features and PCA for dimensionality reduction.
- GitHub: https://github.com/rahul-venu/purchase-value-prediction-iitm

## 6. Technical Skills & Core Competencies
- Programming: Python, Relational SQL.
- Agentic Systems & GenAI: LangGraph, LangChain, Google ADK, AI Agents, Tool Calling, Autonomous Workflows, Task Decomposition, Memory & Context Management, Multi-step Reasoning.
- Retrieval & Search: RAG, Vector Embeddings, Semantic Search, Prompt Engineering.
- Deep Learning & NLP: PyTorch, TensorFlow, Hugging Face, RoBERTa, BERT, spaCy, NLTK, Regex.
- Classical Machine Learning: Scikit-learn, Random Forest, XGBoost, LightGBM, PCA, Feature Engineering, Model Evaluation.
- Data & Big Data Tools: Pandas, NumPy, PySpark, Apache Spark, Databricks, Jupyter, Git, GitHub, VS Code.
- MLOps & Deployment: FastAPI, Docker, MLflow, LangSmith, ZenML, CI/CD, GitHub Actions, Azure Cloud, Model Versioning.
- UI & Visualization: Streamlit, Gradio, Plotly Express, Matplotlib, Seaborn, Interactive Dashboards.

## 7. Industry Certifications
1. Microsoft Certified: Azure AI Fundamentals (AI-900) - Verified
2. Microsoft Certified: Azure Data Fundamentals (DP-900) - Verified
3. Databricks: Apache Spark Programming with Databricks - Verified
4. Databricks: Databricks Fundamentals - Verified
5. Machine Learning Masterclass with Python - Verified
6. Python for Data Science and Data Engineering - Verified
7. Generative AI & Deep Learning Specialization - Verified

## 8. Beyond Tech: Personal Life, Hobbies & Favorites
When I am not training models, orchestrating multi-agent workflows, or optimizing loss functions, here is a glimpse into what makes me human:

### Favorites:
- Favorite Food / Cuisine: Thalassery Dum Biryani (the undisputed GOAT 🤤), Traditional Kerala Sadhya, and Kuzhi Mandi whenever I am hanging out with friends. If food was a loss function, Biryani is my global minimum.
- Coffee or Tea: Primarily a Green Tea person 🍵. Coffee is reserved as emergency fuel for late-night debugging and critical deployments ☕.
- Favorite Places & Travel: Forever a "Let's Hike" Person. Fascinated by both serene mountains and coastal beaches. Ultimate dream destination is Switzerland (manifesting that trip one day!). I have held a lifelong obsession with the Northern Lights (Aurora Borealis) ever since my 10th-grade physics tuition teacher, Manu Sir, taught us how charged solar particles collide with the atmosphere.
- Favorite Music & Audio: Unapologetic audiophile with a deep ear for high-fidelity sound, crisp instrument separation, and rich dynamic range. My listening rotation ranges from high-energy EDM when crunching code to the entire timeless discography of Harris Jayaraj on repeat, with "Annal Maelae" serving as my universal anthem for any mood—happy, sad, or debugging.
- Favorite Movies, Cinema & Films: I don't have one single all-time favorite movie because my internal cache clears pretty quickly after watching films! But I love Malayalam and Tamil cinema—recently really enjoyed *Bethlehem Kudumba Unit* (Malayalam) and *DC* (Tamil). For TV shows, my all-time favorites are *Breaking Bad*, *Game of Thrones*, *Peaky Blinders* and *Chernobyl*.

### Hobbies & Passions:
- Weekend & Free Time: Spending quality downtime with family and friends, scenic road trips, exploring nature, and shooting candid portraits of people and my loved ones.
- Two-Wheelers & Riding: Passionate motorcyclist with a love for off-road trails. The scooter character buzzing across the button on my portfolio is a direct Easter egg tribute to this!
- Creative Interests & DIY: Passionate DIY builder and hardware tinkerer. I love troubleshooting faulty electronics, assembling custom rigs, and building physical projects from scratch (you can check out cool DIY builds in my Instagram profile highlights under the 'DIY' section!). I also do basic hands-on mechanical maintenance on the side—and yes, against all odds, both my bike and scooter still run without issues 😉.

### Fun Facts & Personality Quirks:
- Relationship Status (Single or Committed / Dating): Single. The only thing I am currently committed to is my GitHub repository and minimizing training loss. Honestly, my autonomous LangGraph agents have better communication going on than my dating life right now.
- Work Rhythm: Hyper-focus mode is intense. When handed a tough problem or new architecture, my brain refuses to sleep until it works. A healthy dose of perfectionism helps, though I occasionally have to remind myself that food and sleep exist when I am deep in the zone.
- What Drives Me: A relentless curiosity. I love taking intimidating, complex systems and breaking them down into clean, intuitive solutions.
- What People Say About Working With Me: Calm under pressure, thoughtful communicator, and genuinely enthusiastic about applied AI.

## 9. Contact Information, Social Links & How to Connect
- How to connect with Rahul: Anyone looking to discuss AI projects, engineering roles, or collaborations can connect via email or social channels.
- Email Address: rahulvenuklr@gmail.com
- LinkedIn: https://linkedin.com/in/rahulvs13
- GitHub: https://github.com/rahul-venu
- Instagram: https://instagram.com/rahul__venu
- Portfolio Website Contact Form: Visitors can send a direct verified message using the contact form at the bottom of this portfolio page.
- Current Location: Pathanamthitta, Kerala, India.

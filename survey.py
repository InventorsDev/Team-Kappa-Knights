import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

# Load the CSV file
df = pd.read_csv("survey.csv")

# Optional: Clean up column names manually (fix malformed/truncated ones)
df.columns = [col.strip().split(".")[-1].split("?")[0].split("\n")[0].strip() for col in df.columns]

# Rename misparsed key columns for clarity
df.rename(columns={
    'g Product design, data analysis, Social media marketing etc)': 'Learning Goal',
    'What’s your current learning status': 'Learning Status',
    'On a scale of 1–5, how often do you feel stuck when choosing what to learn next': 'Feeling Stuck (1–5)',
    'Have you ever started a course and not finished it': 'Unfinished Course',
    'How much does your mood or emotional state impact your ability to learn ‎effectively': 'Mood Impact',
    'Would you be interested in a tool that recommends personalized learning paths and tracks your emotional well-being during learning': 'Interested in Tool'
}, inplace=True)

# Start visualization
fig, axs = plt.subplots(3, 2, figsize=(16, 14))
fig.suptitle("Key Insights from Neuroloom Learning Survey", fontsize=18, fontweight='bold')

# 1. Learning Status
sns.countplot(data=df, y='Learning Status', hue='Learning Status', ax=axs[0, 0], palette="Blues_r", legend=False)
axs[0, 0].set_title("Current Learning Status")

# 2. Learning Goals
df['Learning Goal'].value_counts().head(10).plot(kind='barh', ax=axs[0, 1], color='teal')
axs[0, 1].set_title("Top Learning Goals")

# 3. Feeling Stuck Scale
sns.histplot(df['Feeling Stuck (1–5)'], bins=5, ax=axs[1, 0], color='orange')
axs[1, 0].set_title("Frequency of Feeling Stuck")

# 4. Unfinished Course
sns.countplot(data=df, x='Unfinished Course', hue='Unfinished Course', ax=axs[1, 1], palette="Set2", legend=False)
axs[1, 1].set_title("Started but Not Finished a Course")

# 5. Mood Impact
sns.countplot(data=df, y='Mood Impact', hue='Mood Impact', ax=axs[2, 0], palette="coolwarm", legend=False)
axs[2, 0].set_title("Mood/Emotion Impact on Learning")

# 6. Interest in Tool
sns.countplot(data=df, x='Interested in Tool', hue='Interested in Tool', ax=axs[2, 1], palette="viridis", legend=False)
axs[2, 1].set_title("Interest in Personalized Learning Tool")

# Final layout tweaks
plt.tight_layout(rect=[0, 0.03, 1, 0.95])
plt.savefig("neuroloom_survey_insights.png")  # Save image
plt.show()

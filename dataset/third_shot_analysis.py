
import pandas as pd
import matplotlib.pyplot as plt

# Load the data
game_df = pd.read_csv('kaggle-data/game.csv')
rally_df = pd.read_csv('kaggle-data/rally.csv')
shot_df = pd.read_csv('kaggle-data/shot.csv')

# Merge dataframes
rally_shot_df = pd.merge(rally_df, shot_df, on='rally_id')
game_rally_shot_df = pd.merge(rally_shot_df, game_df, on='game_id')

# Filter for third shots
third_shot_df = game_rally_shot_df[game_rally_shot_df['shot_nbr'] == 3]

# Group by skill level and shot type
third_shot_skill_counts = third_shot_df.groupby(['skill_lvl', 'shot_type']).size().unstack(fill_value=0)

# Calculate percentages
third_shot_skill_percentages = third_shot_skill_counts.div(third_shot_skill_counts.sum(axis=1), axis=0) * 100

# Print the results
print("Third Shot Selection by Skill Level (%):")
print(third_shot_skill_percentages)

# Plot the results
third_shot_skill_percentages.plot(kind='bar', stacked=True, figsize=(12, 7))
plt.title('Third Shot Selection by Skill Level')
plt.xlabel('Skill Level')
plt.ylabel('Percentage')
plt.xticks(rotation=45)
plt.legend(title='Shot Type', bbox_to_anchor=(1.05, 1), loc='upper left')
plt.tight_layout()
plt.savefig('third_shot_by_skill_level.png')

print("\nSuccessfully generated third_shot_by_skill_level.png")

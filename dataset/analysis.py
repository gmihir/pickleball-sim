
import pandas as pd
import matplotlib.pyplot as plt

# Load the data
game_df = pd.read_csv('kaggle-data/game.csv')
player_df = pd.read_csv('kaggle-data/player.csv')
rally_df = pd.read_csv('kaggle-data/rally.csv')
shot_df = pd.read_csv('kaggle-data/shot.csv')
team_df = pd.read_csv('kaggle-data/team.csv')
shot_type_ref_df = pd.read_csv('kaggle-data/shot_type_ref.csv')

# Merge dataframes
rally_shot_df = pd.merge(rally_df, shot_df, on='rally_id')
game_rally_shot_df = pd.merge(rally_shot_df, game_df, on='game_id')

# Shot type analysis
shot_type_counts = rally_shot_df['shot_type'].value_counts()
print("Shot Type Counts:")
print(shot_type_counts)

# Rally length analysis
rally_len_counts = rally_df['rally_len'].value_counts().sort_index()
print("\nRally Length Counts:")
print(rally_len_counts)

# Plot rally length distribution
plt.figure(figsize=(10, 6))
rally_len_counts.plot(kind='bar')
plt.title('Rally Length Distribution')
plt.xlabel('Rally Length')
plt.ylabel('Frequency')
plt.savefig('rally_length_distribution.png')

print("\nSuccessfully generated rally_length_distribution.png")

# Analyze third shot types
third_shot_df = rally_shot_df[rally_shot_df['shot_nbr'] == 3]
third_shot_counts = third_shot_df['shot_type'].value_counts()
print("\nThird Shot Type Counts:")
print(third_shot_counts)

# Plot third shot distribution
plt.figure(figsize=(10, 6))
third_shot_counts.plot(kind='pie', autopct='%1.1f%%')
plt.title('Third Shot Type Distribution')
plt.ylabel('')
plt.savefig('third_shot_distribution.png')

print("\nSuccessfully generated third_shot_distribution.png")

import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score
from sklearn.ensemble import IsolationForest
import seaborn as sns

# Load the glassbox data from a JSON file
with open('glassbox_data.json') as f:
    glassbox_data = json.load(f)

# Convert the JSON data to a pandas DataFrame
glassbox_df = pd.DataFrame.from_records(glassbox_data)

# Perform profiling of the glassbox data
profiling_summary = glassbox_df.describe(include='all')
print("Profiling Summary:")
print(profiling_summary)

# Exploratory Data Analysis using seaborn
sns.pairplot(glassbox_df)
plt.show()

# Separate the features (X) and the target variable (y)
X = glassbox_df.drop('target_variable', axis=1)
y = glassbox_df['target_variable']

# Split the data into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Decision Tree Classifier
decision_tree = DecisionTreeClassifier()
decision_tree.fit(X_train, y_train)

# Make predictions using the decision tree model
y_pred_decision_tree = decision_tree.predict(X_test)

# Calculate the accuracy of the decision tree model
decision_tree_accuracy = accuracy_score(y_test, y_pred_decision_tree)
print("Decision Tree Accuracy:", decision_tree_accuracy)

# Logistic Regression
logistic_regression = LogisticRegression()
logistic_regression.fit(X_train, y_train)

# Make predictions using the logistic regression model
y_pred_logistic_regression = logistic_regression.predict(X_test)

# Calculate the accuracy of the logistic regression model
logistic_regression_accuracy = accuracy_score(y_test, y_pred_logistic_regression)
print("Logistic Regression Accuracy:", logistic_regression_accuracy)

# Anomaly Detection using Isolation Forest
anomaly_detector = IsolationForest(contamination=0.05)
anomaly_detector.fit(X_train)

# Predict anomalies in the glassbox data
anomalies = anomaly_detector.predict(X)
anomaly_df = glassbox_df[anomalies == -1]

# Print the detected anomalies
print("\nDetected Anomalies:")
print(anomaly_df)

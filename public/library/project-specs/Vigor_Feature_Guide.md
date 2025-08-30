# Vigor Feature Guide

## Overview

The Vigor feature is a revolutionary addition to the Whitepine civic platform that allows users to channel their emotional conviction and dedication into their votes through gamified activities. This feature transforms passive voting into active engagement by measuring and rewarding the intensity of a user's commitment to a cause.

## What is Vigor?

Vigor represents the emotional and physical energy that users invest in their political convictions. Unlike traditional voting systems that treat all votes equally, Vigor introduces a spectrum of engagement that captures the depth of a citizen's commitment to a cause.

## How Vigor Works

### 1. Three Types of Vigor Activities

#### Shake Vigor
- **Activity**: Users physically shake their device with conviction
- **Measurement**: Intensity, duration, and frequency of shakes
- **Purpose**: Channels physical energy and determination
- **Scoring**: Based on shake intensity (40%), duration (30%), and count (30%)

#### Voice Vigor
- **Activity**: Users speak their signing statement with confidence
- **Measurement**: Voice confidence, duration, and clarity
- **Purpose**: Captures vocal conviction and emotional expression
- **Scoring**: Based on confidence (50%), duration (30%), and clarity (20%)

#### Statement Vigor
- **Activity**: Users write personal statements about their convictions
- **Measurement**: Statement length, emotional content, and focus
- **Purpose**: Documents written commitment and reasoning
- **Scoring**: Based on length (30%), emotion (40%), and focus (30%)

### 2. Vigor Calculation

Each activity generates a Vigor score from 0-100 based on:
- **Intensity**: How much effort/emotion the user invests
- **Duration**: How long they maintain the activity
- **Quality**: How well they perform the activity
- **Focus**: How dedicated they are to the task

### 3. Impact on Petitions

#### Reduced Notification Thresholds
- Each 100 Vigor points reduces the notification threshold by 1 vote
- Representatives are notified sooner when citizens show high conviction
- Maximum reduction: 50% of original threshold

#### Effective Vote Bonus
- Vigor contributions count as additional votes toward petition goals
- Formula: `Effective Votes = Vote Count + (Total Vigor / 100)`
- This amplifies the voice of highly engaged citizens

## User Experience

### 1. Voting Flow
1. User casts their vote on a petition
2. After voting, they can choose to "Contribute Vigor"
3. User selects their preferred vigor type
4. User performs the vigor activity
5. System calculates and records their vigor contribution
6. Petition statistics update to reflect the new vigor

### 2. Visual Feedback
- Real-time progress indicators during activities
- Animated elements that respond to user engagement
- Clear scoring and feedback after completion
- Updated petition statistics showing vigor impact

### 3. Gamification Elements
- Leaderboards showing top vigor contributors
- Achievement tracking for different vigor types
- Progress bars showing vigor thresholds
- Social recognition for high contributors

## Technical Implementation

### Backend Architecture
- **Vigor Model**: Stores individual vigor contributions with activity data
- **Vote Model**: Enhanced with vigor totals and signing statements
- **Petition Model**: Includes vigor thresholds and reduced notification targets
- **API Endpoints**: Complete CRUD operations for vigor management

### Frontend Components
- **VigorActivity**: Modal interface for vigor contribution
- **VigorDisplay**: Shows vigor statistics and impact
- **VigorLeaderboard**: Displays top contributors
- **Integration**: Seamlessly integrated into existing petition flows

### Data Collection
- **Device Sensors**: Accelerometer data for shake detection
- **Audio Recording**: Voice capture and analysis
- **Text Analysis**: Emotion detection in written statements
- **Privacy**: All data is anonymized and secured

## Philosophical Foundation

### Indigenous Wisdom
The Vigor feature is inspired by Indigenous Haudenosaunee principles:
- **Sacred Record**: Every voice is preserved as a covenant
- **Collective Power**: Individual conviction strengthens the whole
- **Peace Through Action**: Measurable commitment creates real change

### Democratic Innovation
- **Emotional Democracy**: Recognizes that passion matters in politics
- **Engagement Spectrum**: Moves beyond binary voting to nuanced participation
- **Accountability**: Creates verifiable records of citizen commitment
- **Transparency**: All vigor contributions are publicly visible

## Benefits

### For Citizens
- **Voice Amplification**: High conviction votes carry more weight
- **Emotional Expression**: Channel passion into measurable action
- **Engagement**: Transform passive voting into active participation
- **Recognition**: Get credit for dedication and effort

### For Representatives
- **Clear Signals**: Understand not just what citizens want, but how much they care
- **Prioritization**: Focus on issues with high citizen conviction
- **Accountability**: Cannot ignore highly engaged constituencies
- **Transparency**: See the full spectrum of citizen engagement

### For Democracy
- **Quality Engagement**: Rewards thoughtful, committed participation
- **Emotional Intelligence**: Recognizes that passion drives political change
- **Innovation**: Modernizes democratic participation for the digital age
- **Inclusivity**: Multiple ways to participate based on personal preferences

## Future Enhancements

### Planned Features
- **Vigor Challenges**: Community-wide vigor events
- **Vigor Badges**: Achievement system for different contribution types
- **Vigor Analytics**: Detailed insights into engagement patterns
- **Mobile Optimization**: Enhanced mobile vigor activities

### Potential Integrations
- **Social Media**: Share vigor achievements
- **Representative Dashboard**: Real-time vigor monitoring
- **Policy Impact**: Track how vigor influences policy outcomes
- **Community Building**: Vigor-based community formation

## Conclusion

The Vigor feature represents a fundamental reimagining of democratic participation. By measuring and rewarding emotional conviction, it creates a more nuanced and engaging democratic system that recognizes the full spectrum of citizen engagement. This innovation honors the Indigenous wisdom of the Great Tree of Peace while leveraging modern technology to strengthen democratic governance.

---

*"Every bead strengthens the belt, each testimony strengthens the whole."*

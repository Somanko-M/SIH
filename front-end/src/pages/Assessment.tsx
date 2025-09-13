import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ArrowLeft, ArrowRight, Sparkles, TrendingUp, Heart } from "lucide-react";

interface Question {
  id: string;
  type: "slider" | "radio" | "emoji";
  question: string;
  description?: string;
  options?: string[];
  emojis?: string[];
  min?: number;
  max?: number;
}

const Assessment = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [showResults, setShowResults] = useState(false);

  const questions: Question[] = [
    {
      id: "mood",
      type: "emoji",
      question: "How are you feeling right now?",
      description: "Pick the emoji that best represents your current mood",
      emojis: ["😢", "😟", "😐", "🙂", "😊", "😄", "🤩"]
    },
    {
      id: "energy",
      type: "slider",
      question: "What's your energy level today?",
      description: "Slide to show how energetic you're feeling",
      min: 1,
      max: 10
    },
    {
      id: "sleep",
      type: "radio",
      question: "How was your sleep last night?",
      options: [
        "Couldn't sleep at all 😴",
        "Very restless, lots of tossing 🌙",
        "Okay but not great 😊",
        "Pretty good sleep ✨",
        "Amazing, feeling refreshed! 🌟"
      ]
    },
    {
      id: "stress",
      type: "slider",
      question: "How stressed do you feel about your current responsibilities?",
      description: "1 means zen-like calm, 10 means overwhelmed",
      min: 1,
      max: 10
    },
    {
      id: "social",
      type: "radio",
      question: "How connected do you feel to others lately?",
      options: [
        "Very isolated and alone 😔",
        "Somewhat disconnected 🤗",
        "It's okay, could be better 👥",
        "Pretty connected 💙",
        "Very supported and loved! 🌟"
      ]
    },
    {
      id: "motivation",
      type: "emoji",
      question: "How motivated do you feel about your goals?",
      emojis: ["😫", "😕", "😐", "🙂", "😤", "🔥", "🚀"]
    },
    {
      id: "anxiety",
      type: "slider",
      question: "Rate your anxiety level today",
      description: "1 means completely calm, 10 means very anxious",
      min: 1,
      max: 10
    }
  ];

  const currentQ = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  const handleAnswer = (value: any) => {
    setAnswers(prev => ({
      ...prev,
      [currentQ.id]: value
    }));
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      setShowResults(true);
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const calculateWellnessScore = () => {
    let totalScore = 0;
    let maxScore = 0;

    // Mood (emoji index out of 6)
    totalScore += (answers.mood || 0);
    maxScore += 6;

    // Energy (1-10)
    totalScore += (answers.energy?.[0] || 5);
    maxScore += 10;

    // Sleep (radio index out of 4)
    totalScore += (answers.sleep || 0);
    maxScore += 4;

    // Stress (inverted, so 10 becomes 1)
    totalScore += (11 - (answers.stress?.[0] || 5));
    maxScore += 10;

    // Social (radio index out of 4)
    totalScore += (answers.social || 0);
    maxScore += 4;

    // Motivation (emoji index out of 6)
    totalScore += (answers.motivation || 0);
    maxScore += 6;

    // Anxiety (inverted)
    totalScore += (11 - (answers.anxiety?.[0] || 5));
    maxScore += 10;

    return Math.round((totalScore / maxScore) * 100);
  };

  const getWellnessMessage = (score: number) => {
    if (score >= 80) return { 
      emoji: "🌟", 
      title: "You're Shining Bright!", 
      message: "Your wellness indicators look fantastic! Keep up the great work with your self-care routine.",
      color: "from-sunshine to-sunset"
    };
    if (score >= 60) return { 
      emoji: "🌱", 
      title: "Growing Stronger!", 
      message: "You're doing well! There are a few areas where some extra attention might help you flourish even more.",
      color: "from-forest to-secondary"
    };
    if (score >= 40) return { 
      emoji: "🤗", 
      title: "It's Okay to Not Be Okay", 
      message: "Everyone has ups and downs. Let's focus on some gentle steps to support your wellbeing.",
      color: "from-accent to-lavender"
    };
    return { 
      emoji: "💙", 
      title: "You're Not Alone", 
      message: "It sounds like you're going through a tough time. Remember, reaching out for support is a sign of strength.",
      color: "from-ocean to-secondary"
    };
  };

  const getRecommendations = (score: number) => {
    if (score >= 80) return [
      { title: "Gratitude Journal Practice", type: "Exercise", emoji: "📝" },
      { title: "Share Your Success Story", type: "Community", emoji: "✨" },
      { title: "Mindful Celebration Ritual", type: "Guide", emoji: "🎉" }
    ];
    if (score >= 60) return [
      { title: "10-Minute Morning Routine", type: "Exercise", emoji: "🌅" },
      { title: "Stress Management Techniques", type: "Article", emoji: "🧘" },
      { title: "Social Connection Activities", type: "Guide", emoji: "👥" }
    ];
    if (score >= 40) return [
      { title: "Gentle Self-Care Checklist", type: "Exercise", emoji: "💆" },
      { title: "Building Resilience", type: "Article", emoji: "💪" },
      { title: "Support Group: Finding Balance", type: "Community", emoji: "🤝" }
    ];
    return [
      { title: "Crisis Support Resources", type: "Emergency", emoji: "🆘" },
      { title: "Gentle Breathing Exercise", type: "Exercise", emoji: "🫁" },
      { title: "Professional Counseling Info", type: "Resource", emoji: "👨‍⚕️" }
    ];
  };

  if (showResults) {
    const score = calculateWellnessScore();
    const wellnessInfo = getWellnessMessage(score);
    const recommendations = getRecommendations(score);

    return (
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <Card className="card-floating text-center">
            <div className="space-y-8">
              {/* Results Header */}
              <div className="space-y-4">
                <div className="text-6xl">{wellnessInfo.emoji}</div>
                <h2 className="text-3xl font-bold">{wellnessInfo.title}</h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  {wellnessInfo.message}
                </p>
              </div>

              {/* Wellness Score */}
              <div className="space-y-4">
                <div className={`w-32 h-32 mx-auto rounded-full bg-gradient-to-r ${wellnessInfo.color} flex items-center justify-center text-white`}>
                  <div className="text-center">
                    <div className="text-3xl font-bold">{score}</div>
                    <div className="text-sm">Wellness Score</div>
                  </div>
                </div>
                <div className="w-full bg-muted rounded-full h-3">
                  <div 
                    className={`progress-wellness h-3 rounded-full`}
                    style={{ width: `${score}%` }}
                  ></div>
                </div>
              </div>

              {/* Personalized Recommendations */}
              <div className="space-y-6">
                <div className="flex items-center justify-center space-x-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  <h3 className="text-xl font-semibold">Personalized for You</h3>
                </div>
                
                <div className="grid md:grid-cols-3 gap-4">
                  {recommendations.map((rec, index) => (
                    <Card key={index} className="card-warm cursor-pointer hover:scale-105 transition-transform">
                      <div className="text-center space-y-3">
                        <div className="text-3xl">{rec.emoji}</div>
                        <h4 className="font-semibold text-sm">{rec.title}</h4>
                        <p className="text-xs text-muted-foreground">{rec.type}</p>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button className="btn-hero">
                  <Heart className="w-4 h-4 mr-2" />
                  Chat with SKye
                </Button>
                <Button className="btn-calm">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  View My Progress
                </Button>
                <Button variant="outline" onClick={() => {
                  setShowResults(false);
                  setCurrentQuestion(0);
                  setAnswers({});
                }}>
                  Take Again
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            Daily Wellness{" "}
            <span className="bg-gradient-to-r from-primary to-sunshine bg-clip-text text-transparent">
              Check-in
            </span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Take a moment to reflect on how you're doing. This helps us understand your wellness journey better! 🌟
          </p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm text-muted-foreground">Question {currentQuestion + 1} of {questions.length}</span>
            <span className="text-sm font-medium text-primary">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-3 bg-muted">
            <div 
              className="progress-wellness h-full rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            ></div>
          </Progress>
        </div>

        {/* Question Card */}
        <Card className="card-floating mb-8">
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-semibold">{currentQ.question}</h2>
              {currentQ.description && (
                <p className="text-muted-foreground">{currentQ.description}</p>
              )}
            </div>

            <div className="space-y-6">
              {/* Emoji Type */}
              {currentQ.type === "emoji" && (
                <div className="flex justify-center space-x-4 flex-wrap gap-y-4">
                  {currentQ.emojis?.map((emoji, index) => (
                    <Button
                      key={index}
                      variant={answers[currentQ.id] === index ? "default" : "outline"}
                      className={`w-16 h-16 text-2xl rounded-2xl transition-all duration-300 hover:scale-110 ${
                        answers[currentQ.id] === index 
                          ? "bg-gradient-to-r from-primary to-sunshine text-white" 
                          : "hover:bg-primary/10"
                      }`}
                      onClick={() => handleAnswer(index)}
                    >
                      {emoji}
                    </Button>
                  ))}
                </div>
              )}

              {/* Slider Type */}
              {currentQ.type === "slider" && (
                <div className="space-y-6">
                  <div className="px-6">
                    <Slider
                      value={answers[currentQ.id] || [5]}
                      onValueChange={(value) => handleAnswer(value)}
                      min={currentQ.min}
                      max={currentQ.max}
                      step={1}
                      className="w-full"
                    />
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground px-6">
                    <span>{currentQ.min} - Low</span>
                    <span className="text-lg font-semibold text-primary">
                      {answers[currentQ.id]?.[0] || 5}
                    </span>
                    <span>{currentQ.max} - High</span>
                  </div>
                </div>
              )}

              {/* Radio Type */}
              {currentQ.type === "radio" && (
                <RadioGroup
                  value={answers[currentQ.id]?.toString()}
                  onValueChange={(value) => handleAnswer(parseInt(value))}
                  className="space-y-4"
                >
                  {currentQ.options?.map((option, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                      <Label 
                        htmlFor={`option-${index}`} 
                        className="flex-1 text-left cursor-pointer p-3 rounded-2xl hover:bg-primary/5 transition-colors"
                      >
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              )}
            </div>
          </div>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={prevQuestion}
            disabled={currentQuestion === 0}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous</span>
          </Button>

          <Button
            onClick={nextQuestion}
            disabled={answers[currentQ.id] === undefined}
            className="btn-hero flex items-center space-x-2"
          >
            <span>{currentQuestion === questions.length - 1 ? "See Results" : "Next"}</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Assessment;
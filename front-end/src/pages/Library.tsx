import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Filter, BookOpen, Play, Headphones, FileText, Clock, Heart, Star, TrendingUp } from "lucide-react";

interface LibraryItem {
  id: string;
  title: string;
  description: string;
  type: "article" | "video" | "audio" | "exercise" | "guide";
  category: string;
  mood: string[];
  duration: string;
  rating: number;
  tags: string[];
  featured: boolean;
  emoji: string;
  url?: string;
}

const Library = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedMood, setSelectedMood] = useState("all");

  const libraryItems: LibraryItem[] = [
    {
      id: "1",
      title: "5-Minute Breathing Reset",
      description: "A quick and effective breathing exercise to center yourself when feeling overwhelmed. Perfect for between classes!",
      type: "exercise",
      category: "Mindfulness",
      mood: ["anxious", "stressed"],
      duration: "5 min",
      rating: 4.9,
      tags: ["breathing", "quick", "stress-relief"],
      featured: true,
      emoji: "🫁",
      url:"https://www.youtube.com/watch?v=I-SFdhVwrVA&utm_source=chatgpt.com"
    },
    {
      id: "2",
      title: "Understanding Test Anxiety",
      description: "Learn why test anxiety happens and discover practical strategies to manage it effectively. You've got this!",
      type: "article",
      category: "Academic Wellness",
      mood: ["anxious", "stressed"],
      duration: "7 min read",
      rating: 4.7,
      tags: ["anxiety", "exams", "coping-strategies"],
      featured: true,
      emoji: "📚",
      url:"https://learningcenter.unc.edu/tips-and-tools/tackling-test-anxiety/?utm_source=chatgpt.com"
    },
    {
      id: "3",
      title: "Sleep Hygiene for Students",
      description: "Transform your sleep with science-backed tips designed specifically for busy student schedules.",
      type: "guide",
      category: "Physical Wellness",
      mood: ["tired", "overwhelmed"],
      duration: "8 min read",
      rating: 4.8,
      tags: ["sleep", "routine", "health"],
      featured: false,
      emoji: "🌙",
      url:"https://www.sleepfoundation.org/sleep-hygiene?utm_source=chatgpt.com"
    },
    {
      id: "4",
      title: "Guided Meditation: Inner Calm",
      description: "A soothing 15-minute meditation to help you find peace and clarity in the midst of chaos.",
      type: "audio",
      category: "Mindfulness",
      mood: ["anxious", "overwhelmed"],
      duration: "15 min",
      rating: 4.9,
      tags: ["meditation", "calm", "guided"],
      featured: true,
      emoji: "🧘",
      url:"https://www.fragrantheart.com/cms/free-audio-meditations?utm_source=chatgpt.com"
    },
    {
      id: "5",
      title: "Building Healthy Relationships",
      description: "Learn how to create and maintain supportive friendships and romantic relationships during college.",
      type: "video",
      category: "Social Wellness",
      mood: ["lonely", "disconnected"],
      duration: "22 min",
      rating: 4.6,
      tags: ["relationships", "communication", "social-skills"],
      featured: false,
      emoji: "💝",
      url:"www.youtube.com/watch?v=ikN4Fozz5Fg&utm_source=chatgpt.com"
    },
    {
      id: "6",
      title: "Dealing with Homesickness",
      description: "Practical advice and emotional support for students struggling with being away from home.",
      type: "article",
      category: "Emotional Wellness",
      mood: ["lonely", "sad"],
      duration: "8 min read",
      rating: 4.5,
      tags: ["homesickness", "adjustment", "coping"],
      featured: false,
      emoji: "🏠",
      url:"https://rutgershealth.org/news/feeling-homesick-how-manage-it-college?utm_source=chatgpt.com"
    },
    {
      id: "7",
      title: "Morning Energy Boost Routine",
      description: "Start your day with intention! A gentle 10-minute routine to energize your body and mind.",
      type: "exercise",
      category: "Physical Wellness",
      mood: ["tired", "unmotivated"],
      duration: "10 min",
      rating: 4.7,
      tags: ["morning", "energy", "routine"],
      featured: false,
      emoji: "🌅",
      url:"https://www.redbull.com/us-en/early-morning-workout-best-exercises?utm_source=chatgpt.com"
    },
    {
      id: "8",
      title: "Overcoming Perfectionism",
      description: "Break free from perfectionist thinking patterns that hold you back from enjoying life and learning.",
      type: "guide",
      category: "Mental Health",
      mood: ["stressed", "overwhelmed"],
      duration: "15 min read",
      rating: 4.8,
      tags: ["perfectionism", "self-compassion", "growth"],
      featured: true,
      emoji: "✨",
      url:"https://www.maplecanyontherapy.com/blog/perfectionism-guide?utm_source=chatgpt.com"
    }
  ];

  const categories = ["all", "Mindfulness", "Academic Wellness", "Physical Wellness", "Social Wellness", "Emotional Wellness", "Mental Health"];
  const moods = ["all", "anxious", "stressed", "tired", "overwhelmed", "unmotivated", "disconnected"];

  const filteredItems = libraryItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
    const matchesMood = selectedMood === "all" || item.mood.includes(selectedMood);
    
    return matchesSearch && matchesCategory && matchesMood;
  });

  const featuredItems = filteredItems.filter(item => item.featured);
  const getItemsByType = (type: string) => filteredItems.filter(item => item.type === type);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "article": return <FileText className="w-4 h-4" />;
      case "video": return <Play className="w-4 h-4" />;
      case "audio": return <Headphones className="w-4 h-4" />;
      case "exercise": return <Heart className="w-4 h-4" />;
      case "guide": return <BookOpen className="w-4 h-4" />;
      default: return <BookOpen className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "article": return "from-ocean/20 to-secondary/20";
      case "video": return "from-sunset/20 to-primary/20";
      case "audio": return "from-lavender/20 to-accent/20";
      case "exercise": return "from-forest/20 to-secondary/20";
      case "guide": return "from-sunshine/20 to-primary/20";
      default: return "from-muted/20 to-muted/40";
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            Wellness{" "}
            <span className="bg-gradient-to-r from-primary to-sunshine bg-clip-text text-transparent">
              Library
            </span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Your curated collection of mental health resources, exercises, and guides. 
            Find exactly what you need for your wellness journey! 📚✨
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search articles, exercises, guides..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 rounded-full bg-muted/50"
              />
            </div>
            <Button variant="outline" className="rounded-full">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className={`rounded-full ${
                  selectedCategory === category 
                    ? "bg-gradient-to-r from-primary to-sunshine text-white" 
                    : "hover:bg-primary/10"
                }`}
              >
                {category === "all" ? "All Topics" : category}
              </Button>
            ))}
          </div>

          {/* Mood Filter */}
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-muted-foreground mr-2 self-center">When you're feeling:</span>
            {moods.map((mood) => (
              <Button
                key={mood}
                variant={selectedMood === mood ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedMood(mood)}
                className={`rounded-full text-xs ${
                  selectedMood === mood 
                    ? "bg-gradient-to-r from-secondary to-ocean text-white" 
                    : "hover:bg-secondary/20"
                }`}
              >
                {mood === "all" ? "any mood" : mood}
              </Button>
            ))}
          </div>
        </div>

        {/* Tabs for Content Organization */}
        <Tabs defaultValue="featured" className="space-y-8">
          <TabsList className="grid w-full grid-cols-6 rounded-full bg-muted/50">
            <TabsTrigger value="featured" className="rounded-full">
              <Star className="w-4 h-4 mr-2" />
              Featured
            </TabsTrigger>
            <TabsTrigger value="articles" className="rounded-full">
              <FileText className="w-4 h-4 mr-2" />
              Articles
            </TabsTrigger>
            <TabsTrigger value="videos" className="rounded-full">
              <Play className="w-4 h-4 mr-2" />
              Videos
            </TabsTrigger>
            <TabsTrigger value="audio" className="rounded-full">
              <Headphones className="w-4 h-4 mr-2" />
              Audio
            </TabsTrigger>
            <TabsTrigger value="exercises" className="rounded-full">
              <Heart className="w-4 h-4 mr-2" />
              Exercises
            </TabsTrigger>
            <TabsTrigger value="guides" className="rounded-full">
              <BookOpen className="w-4 h-4 mr-2" />
              Guides
            </TabsTrigger>
          </TabsList>

          {/* Featured Content */}
          <TabsContent value="featured">
            <div className="space-y-6">
              <div className="flex items-center space-x-2 mb-6">
                <TrendingUp className="w-5 h-5 text-primary" />
                <h2 className="text-2xl font-semibold">Featured Content</h2>
                <Badge className="bg-gradient-to-r from-primary to-sunshine text-white">Popular</Badge>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredItems.map((item) => (
                   <a
                  key={item.id}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <Card key={item.id} className="card-floating group cursor-pointer">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div className={`w-12 h-12 rounded-2xl bg-gradient-to-r ${getTypeColor(item.type)} flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300`}>
                          {item.emoji}
                        </div>
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 fill-sunshine text-sunshine" />
                          <span className="text-sm font-medium">{item.rating}</span>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex items-center space-x-2 mb-2">
                          {getTypeIcon(item.type)}
                          <Badge variant="outline" className="text-xs">
                            {item.type}
                          </Badge>
                          <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            <span>{item.duration}</span>
                          </div>
                        </div>
                        
                        <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                          {item.title}
                        </h3>
                        
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                      
                      <div className="flex flex-wrap gap-1">
                        {item.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs bg-primary/10 text-primary">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </Card>
                  </a>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Articles */}
          <TabsContent value="articles">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getItemsByType("article").map((item) => (
                 <a
                  key={item.id}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                <Card key={item.id} className="card-floating group cursor-pointer">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className={`w-12 h-12 rounded-2xl bg-gradient-to-r ${getTypeColor(item.type)} flex items-center justify-center text-2xl`}>
                        {item.emoji}
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 fill-sunshine text-sunshine" />
                        <span className="text-sm font-medium">{item.rating}</span>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        <span>{item.duration}</span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {item.category}
                      </Badge>
                    </div>
                  </div>
                </Card>
                </a>
              ))}
            </div>
          </TabsContent>

          {/* Similar layouts for other content types */}
          <TabsContent value="videos">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getItemsByType("video").map((item) => (
                <a
                  key={item.id}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                <Card key={item.id} className="card-floating group cursor-pointer">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className={`w-12 h-12 rounded-2xl bg-gradient-to-r ${getTypeColor(item.type)} flex items-center justify-center text-2xl`}>
                        {item.emoji}
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 fill-sunshine text-sunshine" />
                        <span className="text-sm font-medium">{item.rating}</span>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        <span>{item.duration}</span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {item.category}
                      </Badge>
                    </div>
                  </div>
                </Card>
                </a>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="audio">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getItemsByType("audio").map((item) => (
                <a
                  key={item.id}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                <Card key={item.id} className="card-floating group cursor-pointer">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className={`w-12 h-12 rounded-2xl bg-gradient-to-r ${getTypeColor(item.type)} flex items-center justify-center text-2xl`}>
                        {item.emoji}
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 fill-sunshine text-sunshine" />
                        <span className="text-sm font-medium">{item.rating}</span>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        <span>{item.duration}</span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {item.category}
                      </Badge>
                    </div>
                  </div>
                </Card>
                </a>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="exercises">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getItemsByType("exercise").map((item) => (
                <a
                  key={item.id}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                <Card key={item.id} className="card-floating group cursor-pointer">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className={`w-12 h-12 rounded-2xl bg-gradient-to-r ${getTypeColor(item.type)} flex items-center justify-center text-2xl`}>
                        {item.emoji}
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 fill-sunshine text-sunshine" />
                        <span className="text-sm font-medium">{item.rating}</span>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        <span>{item.duration}</span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {item.category}
                      </Badge>
                    </div>
                  </div>
                </Card>
                </a>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="guides">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getItemsByType("guide").map((item) => (
                  <a
                  key={item.id}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                <Card key={item.id} className="card-floating group cursor-pointer">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className={`w-12 h-12 rounded-2xl bg-gradient-to-r ${getTypeColor(item.type)} flex items-center justify-center text-2xl`}>
                        {item.emoji}
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 fill-sunshine text-sunshine" />
                        <span className="text-sm font-medium">{item.rating}</span>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        <span>{item.duration}</span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {item.category}
                      </Badge>
                    </div>
                  </div>
                </Card>
                </a>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* No Results */}
        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold mb-2">No results found</h3>
            <p className="text-muted-foreground mb-6">
              Try adjusting your search terms or filters to find what you're looking for.
            </p>
            <Button 
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("all");
                setSelectedMood("all");
              }}
              className="btn-calm"
            >
              Clear All Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Library;
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Heart, Users, MessageSquare, Plus, Clock, ThumbsUp, Smile, Coffee, BookOpen, Zap, Star } from "lucide-react";

interface GroupMember {
  id: string;
  name: string;
  avatar: string;
  status: "online" | "offline";
  role?: "moderator" | "member";
}

interface Post {
  id: string;
  author: GroupMember;
  content: string;
  timestamp: Date;
  reactions: { type: string; count: number; emoji: string }[];
  replies: number;
}

interface SupportGroup {
  id: string;
  name: string;
  description: string;
  category: string;
  members: number;
  emoji: string;
  color: string;
  featured: boolean;
  topics: string[];
  recentPosts: Post[];
  moderators: GroupMember[];
}

const Groups = () => {
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);

  const supportGroups: SupportGroup[] = [
    {
      id: "1",
      name: "Exam Stress Support",
      description: "A safe space for students dealing with test anxiety and academic pressure. Share study tips, coping strategies, and encourage each other!",
      category: "Academic",
      members: 284,
      emoji: "📚",
      color: "from-ocean/20 to-secondary/20",
      featured: true,
      topics: ["test anxiety", "study tips", "time management", "academic pressure"],
      moderators: [
        { id: "mod1", name: "Sarah Chen", avatar: "SC", status: "online", role: "moderator" },
      ],
      recentPosts: [
        {
          id: "p1",
          author: { id: "u1", name: "Alex Rivera", avatar: "AR", status: "online" },
          content: "Just wanted to share that I tried the breathing technique from last week's discussion before my midterm, and it really helped calm my nerves! 🌟 Anyone else have success stories to share?",
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          reactions: [
            { type: "like", count: 12, emoji: "👍" },
            { type: "heart", count: 8, emoji: "❤️" },
            { type: "celebrate", count: 5, emoji: "🎉" }
          ],
          replies: 7
        }
      ]
    },
    {
      id: "2",
      name: "Late Night Thoughts",
      description: "For those 2am moments when your mind won't quiet down. A judgment-free zone for sharing what's keeping you up and finding peace together.",
      category: "Mental Health",
      members: 156,
      emoji: "🌙",
      color: "from-lavender/20 to-accent/20",
      featured: true,
      topics: ["insomnia", "anxiety", "overthinking", "nighttime support"],
      moderators: [
        { id: "mod2", name: "Jordan Kim", avatar: "JK", status: "online", role: "moderator" },
      ],
      recentPosts: [
        {
          id: "p2",
          author: { id: "u2", name: "Maya Patel", avatar: "MP", status: "online" },
          content: "It's 1:30am and I can't stop thinking about that presentation tomorrow. Anyone else awake? Sometimes just knowing I'm not alone in these late night worries helps 💙",
          timestamp: new Date(Date.now() - 30 * 60 * 1000),
          reactions: [
            { type: "hug", count: 15, emoji: "🤗" },
            { type: "heart", count: 9, emoji: "❤️" }
          ],
          replies: 12
        }
      ]
    },
    {
      id: "3",
      name: "Mindful Moments",
      description: "Daily mindfulness practice, meditation tips, and sharing peaceful moments. Let's cultivate calm together, one breath at a time.",
      category: "Mindfulness",
      members: 203,
      emoji: "🧘",
      color: "from-forest/20 to-secondary/20",
      featured: false,
      topics: ["meditation", "mindfulness", "breathing", "present moment"],
      moderators: [
        { id: "mod3", name: "River Thompson", avatar: "RT", status: "offline", role: "moderator" },
      ],
      recentPosts: []
    },
    {
      id: "4",
      name: "Coffee & Connection",
      description: "Casual conversations about life, friendship, and finding your people in college. Grab your favorite drink and join the chat!",
      category: "Social",
      members: 341,
      emoji: "☕",
      color: "from-sunset/20 to-primary/20",
      featured: true,
      topics: ["friendship", "social life", "college experiences", "casual chat"],
      moderators: [
        { id: "mod4", name: "Casey Williams", avatar: "CW", status: "online", role: "moderator" },
      ],
      recentPosts: [
        {
          id: "p3",
          author: { id: "u3", name: "Sam Chen", avatar: "SC", status: "online" },
          content: "Found the coziest study spot in the library today! Level 3, by the big windows overlooking the quad. Perfect natural light and surprisingly quiet. Where's everyone else's favorite place to hang out on campus? ☀️",
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
          reactions: [
            { type: "like", count: 8, emoji: "👍" },
            { type: "bookmark", count: 6, emoji: "🔖" }
          ],
          replies: 14
        }
      ]
    },
    {
      id: "5",
      name: "Creative Spirits",
      description: "Share your art, writing, music, and creative projects! A supportive community for expressing yourself and celebrating creativity.",
      category: "Creative",
      members: 178,
      emoji: "🎨",
      color: "from-sunshine/20 to-primary/20",
      featured: false,
      topics: ["art", "writing", "music", "creativity", "inspiration"],
      moderators: [
        { id: "mod5", name: "Quinn Davis", avatar: "QD", status: "offline", role: "moderator" },
      ],
      recentPosts: []
    },
    {
      id: "6",
      name: "International Students",
      description: "Connect with fellow international students! Share experiences, cultural insights, and support each other through the unique challenges of studying abroad.",
      category: "Community",
      members: 92,
      emoji: "🌍",
      color: "from-accent/20 to-lavender/20",
      featured: false,
      topics: ["cultural adjustment", "homesickness", "visa questions", "cultural exchange"],
      moderators: [
        { id: "mod6", name: "Aria Nakamura", avatar: "AN", status: "online", role: "moderator" },
      ],
      recentPosts: []
    }
  ];

  const categories = ["All", "Academic", "Mental Health", "Mindfulness", "Social", "Creative", "Community"];
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredGroups = selectedCategory === "All" 
    ? supportGroups 
    : supportGroups.filter(group => group.category === selectedCategory);

  const featuredGroups = filteredGroups.filter(group => group.featured);

  const reactionEmojis = [
    { type: "like", emoji: "👍", label: "Like" },
    { type: "heart", emoji: "❤️", label: "Love" },
    { type: "hug", emoji: "🤗", label: "Hug" },
    { type: "celebrate", emoji: "🎉", label: "Celebrate" },
    { type: "support", emoji: "💪", label: "Support" }
  ];

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            Peer Support{" "}
            <span className="bg-gradient-to-r from-primary to-sunshine bg-clip-text text-transparent">
              Groups
            </span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Connect with fellow students who understand your journey. Share experiences, 
            offer support, and build meaningful friendships in a safe, moderated environment. 🤝✨
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="card-floating text-center">
            <div className="space-y-2">
              <div className="text-2xl">👥</div>
              <div className="text-2xl font-bold text-primary">1,254</div>
              <div className="text-xs text-muted-foreground">Active Members</div>
            </div>
          </Card>
          <Card className="card-floating text-center">
            <div className="space-y-2">
              <div className="text-2xl">💬</div>
              <div className="text-2xl font-bold text-primary">847</div>
              <div className="text-xs text-muted-foreground">Posts This Week</div>
            </div>
          </Card>
          <Card className="card-floating text-center">
            <div className="space-y-2">
              <div className="text-2xl">🤗</div>
              <div className="text-2xl font-bold text-primary">3,201</div>
              <div className="text-xs text-muted-foreground">Support Reactions</div>
            </div>
          </Card>
          <Card className="card-floating text-center">
            <div className="space-y-2">
              <div className="text-2xl">⭐</div>
              <div className="text-2xl font-bold text-primary">6</div>
              <div className="text-xs text-muted-foreground">Active Groups</div>
            </div>
          </Card>
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 justify-center">
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
                {category}
              </Button>
            ))}
          </div>
        </div>

        <Tabs defaultValue="browse" className="space-y-8">
          <TabsList className="grid w-full grid-cols-3 rounded-full bg-muted/50">
            <TabsTrigger value="browse" className="rounded-full">
              <Users className="w-4 h-4 mr-2" />
              Browse Groups
            </TabsTrigger>
            <TabsTrigger value="featured" className="rounded-full">
              <Star className="w-4 h-4 mr-2" />
              Featured
            </TabsTrigger>
            <TabsTrigger value="activity" className="rounded-full">
              <Zap className="w-4 h-4 mr-2" />
              Recent Activity
            </TabsTrigger>
          </TabsList>

          {/* Browse Groups */}
          <TabsContent value="browse">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredGroups.map((group) => (
                <Card key={group.id} className="card-floating group cursor-pointer">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${group.color} flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-300`}>
                        {group.emoji}
                      </div>
                      {group.featured && (
                        <Badge className="bg-gradient-to-r from-primary to-sunshine text-white">
                          Popular
                        </Badge>
                      )}
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                        {group.name}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                        {group.description}
                      </p>
                      
                      <div className="flex flex-wrap gap-1 mb-3">
                        {group.topics.slice(0, 3).map((topic) => (
                          <Badge key={topic} variant="secondary" className="text-xs bg-primary/10 text-primary">
                            {topic}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <Users className="w-4 h-4" />
                          <span>{group.members}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MessageSquare className="w-4 h-4" />
                          <span>{group.recentPosts.length}</span>
                        </div>
                      </div>
                      
                      <Button size="sm" className="btn-calm">
                        <Plus className="w-4 h-4 mr-1" />
                        Join
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Featured Groups */}
          <TabsContent value="featured">
            <div className="grid md:grid-cols-2 gap-8">
              {featuredGroups.map((group) => (
                <Card key={group.id} className="card-floating">
                  <div className="space-y-6">
                    <div className="flex items-start space-x-4">
                      <div className={`w-20 h-20 rounded-3xl bg-gradient-to-r ${group.color} flex items-center justify-center text-4xl`}>
                        {group.emoji}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="text-2xl font-semibold">{group.name}</h3>
                          <Badge className="bg-gradient-to-r from-primary to-sunshine text-white">
                            Featured
                          </Badge>
                        </div>
                        <p className="text-muted-foreground leading-relaxed">
                          {group.description}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <Users className="w-4 h-4" />
                          <span>{group.members} members</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MessageSquare className="w-4 h-4" />
                          <span>Active discussions</span>
                        </div>
                      </div>
                      
                      <Button className="btn-hero">
                        <Plus className="w-4 h-4 mr-2" />
                        Join Group
                      </Button>
                    </div>

                    {/* Recent Activity Preview */}
                    {group.recentPosts.length > 0 && (
                      <div className="border-t border-border/40 pt-4">
                        <h4 className="text-sm font-medium text-muted-foreground mb-3">Recent Activity</h4>
                        {group.recentPosts.slice(0, 1).map((post) => (
                          <div key={post.id} className="space-y-3">
                            <div className="flex items-start space-x-3">
                              <Avatar className="w-8 h-8">
                                <AvatarFallback className="text-xs bg-gradient-to-r from-primary/20 to-sunshine/20">
                                  {post.author.avatar}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-1">
                                  <span className="text-sm font-medium">{post.author.name}</span>
                                  <span className="text-xs text-muted-foreground">
                                    {formatTimeAgo(post.timestamp)}
                                  </span>
                                </div>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                  {post.content}
                                </p>
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-4 ml-11">
                              <div className="flex items-center space-x-2">
                                {post.reactions.map((reaction) => (
                                  <div key={reaction.type} className="flex items-center space-x-1 text-xs">
                                    <span>{reaction.emoji}</span>
                                    <span className="text-muted-foreground">{reaction.count}</span>
                                  </div>
                                ))}
                              </div>
                              <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                                <MessageSquare className="w-3 h-3" />
                                <span>{post.replies} replies</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Recent Activity */}
          <TabsContent value="activity">
            <div className="space-y-6">
              {supportGroups
                .filter(group => group.recentPosts.length > 0)
                .flatMap(group => group.recentPosts.map(post => ({ ...post, groupName: group.name, groupEmoji: group.emoji })))
                .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
                .slice(0, 10)
                .map((post) => (
                  <Card key={post.id} className="card-floating">
                    <div className="space-y-4">
                      <div className="flex items-start space-x-4">
                        <Avatar className="w-12 h-12">
                          <AvatarFallback className="bg-gradient-to-r from-primary/20 to-sunshine/20">
                            {post.author.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="font-medium">{post.author.name}</span>
                            <span className="text-sm text-muted-foreground">in</span>
                            <div className="flex items-center space-x-1">
                              <span className="text-sm">{post.groupEmoji}</span>
                              <span className="text-sm font-medium text-primary">{post.groupName}</span>
                            </div>
                            <span className="text-sm text-muted-foreground">
                              {formatTimeAgo(post.timestamp)}
                            </span>
                          </div>
                          <p className="text-muted-foreground leading-relaxed">
                            {post.content}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between ml-16">
                        <div className="flex items-center space-x-4">
                          {post.reactions.map((reaction) => (
                            <Button
                              key={reaction.type}
                              variant="ghost"
                              size="sm"
                              className="h-8 px-3 hover:bg-primary/10 rounded-full"
                            >
                              <span className="mr-1">{reaction.emoji}</span>
                              <span className="text-xs">{reaction.count}</span>
                            </Button>
                          ))}
                        </div>
                        
                        <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                          <MessageSquare className="w-4 h-4" />
                          <span>{post.replies} replies</span>
                        </div>
                      </div>

                      {/* Reaction Bar */}
                      <div className="flex items-center space-x-2 ml-16 pt-2 border-t border-border/40">
                        {reactionEmojis.map((reaction) => (
                          <Button
                            key={reaction.type}
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 hover:bg-primary/10 rounded-full"
                            title={reaction.label}
                          >
                            {reaction.emoji}
                          </Button>
                        ))}
                        <Button variant="ghost" size="sm" className="text-xs text-muted-foreground hover:text-primary">
                          Reply
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Groups;
import { useState } from "react";
import { StoryForm, StoryFormData } from "@/components/StoryForm";
import { StoryDisplay } from "@/components/StoryDisplay";
import { SightWordManager } from "@/components/SightWordManager";
import { FavoriteStories } from "@/components/FavoriteStories";
import { SightWord } from "@/types/sightWords";
import { motion } from "framer-motion";
import { generateStory } from "@/services/openrouter";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Index = () => {
  const [story, setStory] = useState<{
    title: string;
    content: string;
    readingLevel?: string;
    theme?: string;
  } | null>(null);
  const [words, setWords] = useState<SightWord[]>([]);
  const {
    user,
    logout
  } = useAuth();

  const handleSubmit = async (data: StoryFormData) => {
    const activeWords = words.filter(word => word.active);
    
    if (data.useSightWords && activeWords.length === 0) {
      toast.error("Please add and activate some sight words before generating a story");
      return;
    }
    
    try {
      console.log("=== Starting Story Generation ===");
      console.log("Form data:", data);
      console.log("Active sight words:", activeWords.map(w => w.word));
      
      const toastId = toast.loading("Generating your story...");
      const activeWordStrings = activeWords.map(word => word.word);
      
      const generatedStory = await generateStory(
        data.useSightWords ? activeWordStrings : [], 
        data.readingLevel, 
        data.interestLevel,
        data.theme, 
        data.isDrSeussStyle
      );
      
      toast.dismiss(toastId);
      setStory({
        ...generatedStory,
        readingLevel: data.readingLevel,
        theme: data.theme
      });
      toast.success("Story generated successfully!");
      console.log("=== Story Generation Complete ===");
    } catch (error) {
      console.error("=== Story Generation Failed ===");
      console.error("Error:", error);
      toast.error("Failed to generate story. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100">
      <div className="container px-4 py-4 sm:py-8 max-w-6xl mx-auto">
        {/* Header with Logo and Logout Button */}
        <div className="flex justify-between items-start mb-6 sm:mb-8">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center flex-1"
          >
            <div className="mb-4">
              <img 
                src="/lovable-uploads/79708384-34ad-45b6-af27-6fb7e037e385.png" 
                alt="StoryBridge Logo" 
                className="w-48 sm:w-64 h-auto mx-auto"
              />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent px-4">
              Create Magical Stories for Young Readers
            </h1>
          </motion.div>

          <Button 
            variant="outline" 
            onClick={logout} 
            className="clay-button min-h-[44px] ml-4"
          >
            Logout
          </Button>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          <div className="clay-card p-4 sm:p-8">
            <Tabs defaultValue="story" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6 sm:mb-8 bg-transparent p-2 gap-2 h-auto">
                <TabsTrigger value="story" className="clay-tab text-gray-700 font-semibold min-h-[44px] text-sm sm:text-base">
                  📚 Generate Story
                </TabsTrigger>
                <TabsTrigger value="words" className="clay-tab text-gray-700 font-semibold min-h-[44px] text-sm sm:text-base">
                  🎯 Sight Words
                </TabsTrigger>
                <TabsTrigger value="favorites" className="clay-tab text-gray-700 font-semibold min-h-[44px] text-sm sm:text-base">
                  ❤️ Favorites
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="story">
                <StoryForm onSubmit={handleSubmit} />
                {story && (
                  <StoryDisplay 
                    title={story.title} 
                    content={story.content}
                    readingLevel={story.readingLevel}
                    theme={story.theme}
                  />
                )}
              </TabsContent>
              
              <TabsContent value="words">
                <SightWordManager words={words} setWords={setWords} />
              </TabsContent>

              <TabsContent value="favorites">
                <FavoriteStories />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;

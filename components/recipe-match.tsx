"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChefHat, ArrowLeft, BookMarked, Heart } from "lucide-react"
import { recipes } from "@/lib/recipes"

interface RecipeMatchProps {
  onBack: () => void
  onViewSaved: () => void
}

export function RecipeMatch({ onBack, onViewSaved }: RecipeMatchProps) {
  const [ingredients, setIngredients] = useState<string[]>([])
  const [matchedRecipes, setMatchedRecipes] = useState<typeof recipes>([])
  const [savedRecipes, setSavedRecipes] = useState<string[]>([])

  useEffect(() => {
    // Load ingredients
    const stored = localStorage.getItem("recipeGenieIngredients")
    if (stored) {
      const userIngredients = JSON.parse(stored)
      setIngredients(userIngredients)

      // Match recipes
      const matches = recipes.filter((recipe) => {
        const matchCount = recipe.ingredients.filter((ing) =>
          userIngredients.some((userIng: string) => ing.toLowerCase().includes(userIng)),
        ).length
        return matchCount >= 2 // At least 2 ingredients match
      })
      setMatchedRecipes(matches)
    }

    // Load saved recipes
    const saved = localStorage.getItem("recipeGenieSaved")
    if (saved) {
      setSavedRecipes(JSON.parse(saved))
    }
  }, [])

  const toggleSave = (recipeId: string) => {
    let updated: string[]
    if (savedRecipes.includes(recipeId)) {
      updated = savedRecipes.filter((id) => id !== recipeId)
    } else {
      updated = [...savedRecipes, recipeId]
    }
    setSavedRecipes(updated)
    localStorage.setItem("recipeGenieSaved", JSON.stringify(updated))
  }

  return (
    <div className="min-h-screen">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-primary p-2">
                <ChefHat className="w-6 h-6 text-primary-foreground" />
              </div>
              <h1 className="text-xl font-bold">Recipe Genie</h1>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={onViewSaved}>
                <BookMarked className="w-4 h-4 mr-2" />
                Saved ({savedRecipes.length})
              </Button>
              <Button variant="ghost" size="sm" onClick={onBack}>
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold text-balance">Recipe Matches</h2>
            <p className="text-muted-foreground text-balance">
              Found {matchedRecipes.length} recipes with your ingredients
            </p>
          </div>

          <Card className="border-2 bg-muted/50">
            <CardHeader>
              <CardTitle className="text-base">Your Ingredients</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {ingredients.map((ingredient) => (
                  <Badge key={ingredient} variant="secondary">
                    {ingredient}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            {matchedRecipes.map((recipe) => {
              const matchCount = recipe.ingredients.filter((ing) =>
                ingredients.some((userIng) => ing.toLowerCase().includes(userIng)),
              ).length
              const isSaved = savedRecipes.includes(recipe.id)

              return (
                <Card key={recipe.id} className="border-2 hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <CardTitle className="text-xl">{recipe.name}</CardTitle>
                        <CardDescription className="mt-1">
                          {matchCount} of {recipe.ingredients.length} ingredients matched
                        </CardDescription>
                      </div>
                      <Button
                        variant={isSaved ? "default" : "outline"}
                        size="icon"
                        onClick={() => toggleSave(recipe.id)}
                      >
                        <Heart className={`w-4 h-4 ${isSaved ? "fill-current" : ""}`} />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm font-medium mb-2">Ingredients needed:</p>
                      <div className="flex flex-wrap gap-1.5">
                        {recipe.ingredients.map((ing, idx) => {
                          const hasIngredient = ingredients.some((userIng) => ing.toLowerCase().includes(userIng))
                          return (
                            <Badge key={idx} variant={hasIngredient ? "default" : "outline"} className="text-xs">
                              {ing}
                            </Badge>
                          )
                        })}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-2">Instructions:</p>
                      <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                        {recipe.instructions.map((step, idx) => (
                          <li key={idx} className="leading-relaxed">
                            {step}
                          </li>
                        ))}
                      </ol>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {matchedRecipes.length === 0 && (
            <Card className="border-2">
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground text-balance">
                  No recipes found with your current ingredients. Try adding more ingredients!
                </p>
                <Button onClick={onBack} className="mt-4">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Ingredients
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}

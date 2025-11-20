"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChefHat, X, Search, BookMarked, LogOut } from "lucide-react" 
import { allIngredients } from "../lib/recipes";

interface IngredientInputProps {
  user: { name: string; email: string } | null
  onLogout: () => void
  onViewSaved: () => void
  onFindRecipes: () => void
}

export function IngredientInput({ user, onLogout, onViewSaved, onFindRecipes }: IngredientInputProps) {
  const [ingredients, setIngredients] = useState<string[]>([])
  const [currentIngredient, setCurrentIngredient] = useState("")
  const [suggestions, setSuggestions] = useState<string[]>([])

  useEffect(() => {
    // Load ingredients from localStorage
    const stored = localStorage.getItem("recipeGenieIngredients")
    if (stored) {
      setIngredients(JSON.parse(stored))
    }
  }, [])

  const addIngredient = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = currentIngredient.trim().toLowerCase()
    if (trimmed && !ingredients.includes(trimmed)) {
      const updated = [...ingredients, trimmed]
      setIngredients(updated)
      localStorage.setItem("recipeGenieIngredients", JSON.stringify(updated))
      setCurrentIngredient("")
      setSuggestions([])
    }
  }

  const removeIngredient = (ingredient: string) => {
    const updated = ingredients.filter((i) => i !== ingredient)
    setIngredients(updated)
    localStorage.setItem("recipeGenieIngredients", JSON.stringify(updated))
  }

  // Update suggestions as user types
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setCurrentIngredient(value)

    if (value.trim()) {
      const matches = allIngredients
        .filter(
          (item) =>
            item.toLowerCase().includes(value.toLowerCase()) &&
            !ingredients.includes(item.toLowerCase())
        )
        .slice(0, 5) // show top 5 suggestions
      setSuggestions(matches)
    } else {
      setSuggestions([])
    }
  }

  const selectSuggestion = (suggestion: string) => {
    if (!ingredients.includes(suggestion.toLowerCase())) {
      const updated = [...ingredients, suggestion.toLowerCase()]
      setIngredients(updated)
      localStorage.setItem("recipeGenieIngredients", JSON.stringify(updated))
    }
    setCurrentIngredient("")
    setSuggestions([])
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
              <div>
                <h1 className="text-xl font-bold">Recipe Genie</h1>
                <p className="text-sm text-muted-foreground">Hello, {user?.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={onViewSaved}>
                <BookMarked className="w-4 h-4 mr-2" />
                Saved
              </Button>
              <Button variant="ghost" size="sm" onClick={onLogout}>
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold text-balance">{"What's in your kitchen?"}</h2>
            <p className="text-muted-foreground text-balance">
              Add the ingredients you have and discover amazing recipes
            </p>
          </div>

          <Card className="border-2">
            <CardHeader>
              <CardTitle>Add Ingredients</CardTitle>
              <CardDescription>Enter one ingredient at a time</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={addIngredient} className="flex flex-col gap-2 relative">
                <Input
                  type="text"
                  placeholder="e.g., chicken, tomatoes, pasta..."
                  value={currentIngredient}
                  onChange={handleChange}
                  className="h-11"
                />
                {suggestions.length > 0 && (
                  <ul className="absolute top-14 left-0 right-0 bg-white border rounded-md shadow-md max-h-40 overflow-y-auto z-50">
                    {suggestions.map((s) => (
                      <li
                        key={s}
                        onClick={() => selectSuggestion(s)}
                        className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                      >
                        {s}
                      </li>
                    ))}
                  </ul>
                )}
                <Button type="submit" size="lg" className="mt-2">
                  Add
                </Button>
              </form>

              {ingredients.length > 0 && (
                <div className="space-y-3">
                  <p className="text-sm font-medium">Your ingredients ({ingredients.length})</p>
                  <div className="flex flex-wrap gap-2">
                    {ingredients.map((ingredient) => (
                      <Badge key={ingredient} variant="secondary" className="px-3 py-2 text-sm font-medium">
                        {ingredient}
                        <button
                          onClick={() => removeIngredient(ingredient)}
                          className="ml-2 hover:text-destructive transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {ingredients.length >= 2 && (
                <Button onClick={onFindRecipes} size="lg" className="w-full">
                  <Search className="w-4 h-4 mr-2" />
                  Find Recipes ({ingredients.length} ingredients)
                </Button>
              )}

              {ingredients.length === 1 && (
                <p className="text-sm text-center text-muted-foreground">
                  Add at least one more ingredient to find recipes
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

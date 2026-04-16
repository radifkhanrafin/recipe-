"use client"

import { useState, useEffect } from "react"
import { Login } from "@/components/login"
import { IngredientInput } from "@/components/ingredient-input"
import { RecipeMatch } from "@/components/recipe-match"
import { SavedRecipes } from "@/components/saved-recipes"

export default function Home() {
  const [currentView, setCurrentView] = useState<"login" | "ingredients" | "recipes" | "saved">("login")
  const [user, setUser] = useState<{ name: string; email: string } | null>(null)

  const [searchQuery, setSearchQuery] = useState<string | null>(null)
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([])
  useEffect(() => {
    // Check if user is already logged in
    const storedUser = localStorage.getItem("recipeGenieUser")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
      setCurrentView("ingredients")
    }
  }, [])

  const handleLogin = (name: string, email: string) => {
    const userData = { name, email }
    localStorage.setItem("recipeGenieUser", JSON.stringify(userData))
    setUser(userData)
    setCurrentView("ingredients")
  }

  const handleLogout = () => {
    localStorage.removeItem("recipeGenieUser")
    setUser(null)
    setCurrentView("login")
  }
  const handleFindRecipes = (query?: string) => {
    if (query) {
      setSearchQuery(query) // recipe name এসেছে
      setSelectedIngredients([])
    } else {
      const stored = localStorage.getItem("recipeGenieIngredients")
      if (stored) {
        setSelectedIngredients(JSON.parse(stored)) // ingredient mode
      }
      setSearchQuery(null)
    }

    setCurrentView("recipes")
  }



  return (
    <div className="min-h-screen bg-background">
      {currentView === "login" && <Login onLogin={handleLogin} />}
      {currentView === "ingredients" && (
        <IngredientInput
          user={user}
          onLogout={handleLogout}
          onViewSaved={() => setCurrentView("saved")}
          onFindRecipes={handleFindRecipes}
        />
      )}
      {currentView === "recipes" && (
        <RecipeMatch
          query={searchQuery}
          ingredients={selectedIngredients}
          onBack={() => setCurrentView("ingredients")}
          onViewSaved={() => setCurrentView("saved")}
        />
      )}
      {currentView === "saved" && <SavedRecipes onBack={() => setCurrentView("ingredients")} />}
    </div>
  )
}

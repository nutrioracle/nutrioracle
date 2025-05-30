frontend/src/pages/Dashboard.tsx
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectItem } from "@/components/ui/select";

const NutriOracleCore = () => {
  const [mealPlan, setMealPlan] = useState(null);
  const [chatQuestion, setChatQuestion] = useState("");
  const [chatResponse, setChatResponse] = useState("");
  const [dietType, setDietType] = useState("vegan");
  const [goals, setGoals] = useState("");
  const [preferences, setPreferences] = useState("");
  const [restrictions, setRestrictions] = useState("");
  const [days, setDays] = useState(7);

  const handleGeneratePlan = async () => {
    const response = await fetch("/api/meal-plan/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        diet_type: dietType,
        goals,
        preferences: preferences.split(",").map(p => p.trim()),
        restrictions: restrictions.split(",").map(r => r.trim()),
        days
      })
    });
    const data = await response.json();
    setMealPlan(data);
  };

  const handleSendChat = async () => {
    const response = await fetch("/api/chat/nutritionist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: chatQuestion })
    });
    const data = await response.json();
    setChatResponse(data.response);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">

      {/* Meal Plan Generator */}
      <Card className="col-span-1 md:col-span-2">
        <CardContent className="space-y-4">
          <h2 className="text-xl font-semibold">Generate Meal Plan</h2>
          <Select onValueChange={setDietType} defaultValue={dietType}>
            <SelectItem value="pcos">PCOS</SelectItem>
            <SelectItem value="diabetic">Diabetic</SelectItem>
            <SelectItem value="vegan">Vegan</SelectItem>
            <SelectItem value="bodybuilding">Bodybuilding</SelectItem>
            <SelectItem value="fodmap">Low FODMAP</SelectItem>
          </Select>
          <Input placeholder="Health Goals" value={goals} onChange={e => setGoals(e.target.value)} />
          <Input placeholder="Food Preferences (comma separated)" value={preferences} onChange={e => setPreferences(e.target.value)} />
          <Input placeholder="Food Restrictions (comma separated)" value={restrictions} onChange={e => setRestrictions(e.target.value)} />
          <Input type="number" min={1} max={30} value={days} onChange={e => setDays(Number(e.target.value))} placeholder="Number of Days" />
          <Button className="w-full" onClick={handleGeneratePlan}>Generate Plan</Button>

          {mealPlan && (
            <div className="space-y-2">
              {mealPlan.map((day, i) => (
                <div key={i} className="border p-2 rounded">
                  <h3 className="font-semibold">Day {day.day}</h3>
                  {day.meals.map((meal, idx) => (
                    <div key={idx} className="pl-4">
                      <p className="font-medium">{meal.type}: {meal.recipe.name}</p>
                      <ul className="list-disc ml-4">
                        {meal.recipe.ingredients.map((ing, j) => (
                          <li key={j}>{ing}</li>
                        ))}
                      </ul>
                      <p className="text-sm italic">{meal.recipe.instructions}</p>
                      <p className="text-sm">Calories: {meal.recipe.nutrition.calories} | Protein: {meal.recipe.nutrition.protein}g | Carbs: {meal.recipe.nutrition.carbs}g | Fat: {meal.recipe.nutrition.fat}g</p>
                    </div>
                  ))}
                  <p className="text-sm mt-2">Daily Total – Calories: {day.daily_totals.calories}, Protein: {day.daily_totals.protein}g</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Chat with Nutritionist */}
      <Card className="col-span-1">
        <CardContent className="space-y-2">
          <h2 className="text-xl font-semibold">AI Nutritionist Chat</h2>
          <Textarea placeholder="Ask your nutritionist..." rows={6} value={chatQuestion} onChange={e => setChatQuestion(e.target.value)} />
          <Button className="w-full" onClick={handleSendChat}>Send</Button>
          <div className="text-sm mt-2">{chatResponse}</div>
          <div className="text-xs text-muted-foreground mt-2">
            Pro feature: Personalized advice requires subscription.
          </div>
        </CardContent>
      </Card>

      {/* Grocery List Viewer */}
      <Card className="col-span-1 md:col-span-3">
        <CardContent className="space-y-4">
          <h2 className="text-xl font-semibold">Grocery List</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Spinach – <a href="#" className="text-blue-500 underline">Buy on Amazon</a></li>
            <li>Chicken Breast – <a href="#" className="text-blue-500 underline">Buy on Instacart</a></li>
            <li>Almond Milk – <a href="#" className="text-blue-500 underline">Buy on Walmart</a></li>
          </ul>
          <Button className="w-full">Export PDF (Pro)</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default NutriOracleCore;

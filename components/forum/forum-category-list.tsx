import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface ForumCategory {
  id: string
  name: string
  description?: string
  threadCount: number
}

interface ForumCategoryListProps {
  categories: ForumCategory[]
  activeCategory?: string
}

export function ForumCategoryList({ categories, activeCategory }: ForumCategoryListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Categories</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2">
          <Button variant={!activeCategory ? "default" : "ghost"} className="justify-start" asChild>
            <Link href="/forum">All Categories</Link>
          </Button>
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={activeCategory === category.id ? "default" : "ghost"}
              className="justify-between"
              asChild
            >
              <Link href={`/forum/category/${category.id}`}>
                {category.name}
                <Badge variant="outline" className="ml-2">
                  {category.threadCount}
                </Badge>
              </Link>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

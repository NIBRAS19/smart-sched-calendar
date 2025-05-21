import React, { ReactNode } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface SettingsCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  children: ReactNode;
}

export default function SettingsCard({ icon, title, description, children }: SettingsCardProps) {
  return (
    <Card className="shadow-sm border-muted/60 transition-all">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary/10 text-primary shrink-0">
            {icon}
          </div>
          <div>
            <CardTitle className="text-lg">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-2 pb-5">
        {children}
      </CardContent>
    </Card>
  );
}

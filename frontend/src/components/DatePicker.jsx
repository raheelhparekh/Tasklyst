"use client";

import React, { useEffect, useState } from "react";
import { CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// ✅ Utility to format a Date as "June 01, 2025"
function formatDate(date) {
  if (!date || !(date instanceof Date)) return "";

  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

// ✅ Utility to check if a value is a valid Date
function isValidDate(date) {
  return date instanceof Date && !isNaN(date.getTime());
}

// ✅ Core Calendar Input UI
export function Calendar28({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState(value || new Date());
  const [month, setMonth] = useState(date);
  const [inputValue, setInputValue] = useState(formatDate(date));

  useEffect(() => {
    if (isValidDate(value)) {
      setDate(value);
      setMonth(value);
      setInputValue(formatDate(value));
    }
  }, [value]);

  return (
    <div className="flex flex-col gap-3">
      <Label htmlFor="date" className="px-1">
        Due Date
      </Label>
      <div className="relative flex gap-2">
        <Input
          id="date"
          value={inputValue}
          placeholder="June 01, 2025"
          className="bg-background pr-10"
          onChange={(e) => {
            const input = e.target.value;
            const parsed = new Date(input);
            setInputValue(input);
            if (isValidDate(parsed)) {
              setDate(parsed);
              setMonth(parsed);
              onChange(parsed);
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setOpen(true);
            }
          }}
        />
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              id="date-picker"
              variant="ghost"
              className="absolute top-1/2 right-2 size-6 -translate-y-1/2"
            >
              <CalendarIcon className="size-3.5" />
              <span className="sr-only">Select date</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-auto overflow-hidden p-0"
            align="end"
            alignOffset={-8}
            sideOffset={10}
          >
            <Calendar
              mode="single"
              selected={date}
              captionLayout="dropdown"
              month={month}
              onMonthChange={setMonth}
              onSelect={(selectedDate) => {
                if (isValidDate(selectedDate)) {
                  setDate(selectedDate);
                  setInputValue(formatDate(selectedDate));
                  onChange(selectedDate);
                  setOpen(false);
                }
              }}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}

// ✅ Wrapper with parent-managed value
export function DatePicker({ value, onChange }) {
  const [internalDate, setInternalDate] = useState(value || new Date());

  useEffect(() => {
    if (isValidDate(value)) {
      setInternalDate(value);
    }
  }, [value]);

  return (
    <Calendar28
      value={internalDate}
      onChange={(newDate) => {
        setInternalDate(newDate);
        onChange?.(newDate);
      }}
    />
  );
}

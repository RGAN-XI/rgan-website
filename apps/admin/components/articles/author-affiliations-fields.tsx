"use client";
import React from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { Building2, X } from "lucide-react";
import type { ArticleFormInput } from "@gad/schema";
import { Button } from "@gad/components/ui/button";
import { Input } from "@gad/components/ui/input";
import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@gad/components/ui/form";

const EMPTY_AFFILIATION = {
  school: "",
  department: "",
  city: "",
  country: "",
};

type AuthorAffiliationsFieldsProps = {
  authorIndex: number;
};

/**
 * Repeatable institution / department / city / country group for a single
 * author. Lives inside the article form, so it reads the form via context.
 */
export function AuthorAffiliationsFields({
  authorIndex,
}: AuthorAffiliationsFieldsProps) {
  const {
    control,
    formState: { errors },
  } = useFormContext<ArticleFormInput>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: `authors.${authorIndex}.affiliations`,
  });

  const arrayError =
    errors.authors?.[authorIndex]?.affiliations?.root?.message ??
    errors.authors?.[authorIndex]?.affiliations?.message;

  return (
    <div className="mb-3 space-y-3">
      {fields.map((affiliationField, affiliationIndex) => (
        <div
          key={affiliationField.id}
          className="relative rounded-lg border border-dashed border-border p-3"
        >
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              Institution {affiliationIndex + 1}
            </span>
            {fields.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => remove(affiliationIndex)}
                className="h-6 w-6 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                title="Remove institution"
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
          <div className="mb-3 grid gap-3 sm:grid-cols-2">
            <FormField
              control={control}
              name={`authors.${authorIndex}.affiliations.${affiliationIndex}.school`}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="School / Institution *" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name={`authors.${authorIndex}.affiliations.${affiliationIndex}.department`}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Department" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <FormField
              control={control}
              name={`authors.${authorIndex}.affiliations.${affiliationIndex}.city`}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="City" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name={`authors.${authorIndex}.affiliations.${affiliationIndex}.country`}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Country" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      ))}

      {arrayError && (
        <p className="text-sm font-medium text-destructive">{arrayError}</p>
      )}

      <Button
        type="button"
        variant="link"
        size="sm"
        onClick={() => append({ ...EMPTY_AFFILIATION })}
        className="h-auto gap-1.5 p-0 text-xs"
      >
        <Building2 className="h-3.5 w-3.5" />
        Add Institution
      </Button>
    </div>
  );
}

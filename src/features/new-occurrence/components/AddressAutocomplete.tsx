"use client";

/// <reference types="@types/google.maps" />

import { useEffect, useRef, useState } from "react";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";

type AddressPick = {
  address: string;
  placeId: string;
  lat: number;
  lng: number;
};

type Prediction = {
  description: string;
  place_id: string;
};

type Services = {
  autocomplete: google.maps.places.AutocompleteService;
  places: google.maps.places.PlacesService;
};

export default function AddressAutocomplete({
  onPick,
  label = "Endereço",
}: {
  onPick: (data: AddressPick) => void;
  label?: string;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [value, setValue] = useState("");
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [open, setOpen] = useState(false);
  const [services, setServices] = useState<Services | null>(null);

  useEffect(() => {
    if (window.google?.maps?.places) {
      setServices({
        autocomplete: new window.google.maps.places.AutocompleteService(),
        places: new window.google.maps.places.PlacesService(
          document.createElement("div"),
        ),
      });
      return;
    }

    const interval = setInterval(() => {
      if (window.google?.maps?.places) {
        setServices({
          autocomplete: new window.google.maps.places.AutocompleteService(),
          places: new window.google.maps.places.PlacesService(
            document.createElement("div"),
          ),
        });
        clearInterval(interval);
      }
    }, 150);

    return () => clearInterval(interval);
  }, []);

  // debounce simples
  useEffect(() => {
    if (!services) {
      setPredictions([]);
      setOpen(false);
      return;
    }
    if (!value.trim()) {
      setPredictions([]);
      setOpen(false);
      return;
    }

    const t = window.setTimeout(() => {
      services.autocomplete.getPlacePredictions(
        {
          input: value,
          // opcional: restringir ao BR
          componentRestrictions: { country: "br" },
          types: ["address"],
        },
        (res) => {
          const list = Array.isArray(res)
            ? res.map((p) => ({
                description: p.description,
                place_id: p.place_id,
              }))
            : [];
          setPredictions(list);
          setOpen(list.length > 0);
        },
      );
    }, 250);

    return () => window.clearTimeout(t);
  }, [value, services]);

  const pick = (p: Prediction) => {
    if (!services) return;

    services.places.getDetails(
      {
        placeId: p.place_id,
        // campos necessários pra reduzir custo e payload
        fields: ["formatted_address", "geometry", "place_id"],
      },
      (place, status) => {
        if (
          status !== google.maps.places.PlacesServiceStatus.OK ||
          !place?.geometry?.location
        ) {
          return;
        }

        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        const address = place.formatted_address ?? p.description;

        setValue(address);
        setPredictions([]);
        setOpen(false);

        onPick({
          address,
          placeId: place.place_id ?? p.place_id,
          lat,
          lng,
        });
      },
    );
  };

  const canUse = !!services;

  return (
    <div style={{ position: "relative" }}>
      <TextField
        fullWidth
        label={label}
        inputRef={inputRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onFocus={() => setOpen(predictions.length > 0)}
        onBlur={() => {
          window.setTimeout(() => setOpen(false), 150);
        }}
        placeholder={
          canUse ? "Digite seu endereço..." : "Carregando Google Places..."
        }
        disabled={!canUse}
      />

      {open ? (
        <Paper
          elevation={6}
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: "100%",
            marginTop: 8,
            zIndex: 20,
            maxHeight: 280,
            overflow: "auto",
          }}
        >
          <List dense>
            {predictions.map((p) => (
              <ListItemButton key={p.place_id} onMouseDown={() => pick(p)}>
                <ListItemText primary={p.description} />
              </ListItemButton>
            ))}
          </List>
        </Paper>
      ) : null}
    </div>
  );
}

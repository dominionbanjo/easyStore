import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectLocationState,
  setLocationState,
  type LocationSource,
} from "@/features/locationSlice";
import { selectCurrentUser } from "@/features/userSlice";
import { NigeriaData } from "@/utils/nigeria-data";

type NominatimReverseResponse = {
  address?: { state?: string };
};

interface GeolocationPositionResult {
  coords: { latitude: number; longitude: number };
}

const GEOCODE_URL = "https://nominatim.openstreetmap.org/reverse";
const GEOLOCATION_TIMEOUT_MS = 10_000;

/* Module-level guard so multiple mounted hook instances never double-attempt GPS */
let globalGpsAttempted = false;

function normalizeStateName(raw: string | undefined): string | null {
  if (!raw) return null;
  const normalized = raw.trim();
  if (!normalized) return null;

  const exact = NigeriaData.getStates().find(
    (s) => s.name.toLowerCase() === normalized.toLowerCase(),
  );
  if (exact) return exact.name;

  const partial = NigeriaData.getStates().find((s) =>
    s.name.toLowerCase().includes(normalized.toLowerCase()),
  );
  return partial ? partial.name : null;
}

export function useLocationPreference() {
  const dispatch = useDispatch();
  const locationState = useSelector(selectLocationState);
  const currentUser = useSelector(selectCurrentUser);

  const setStateFromName = useCallback(
    (stateName: string, source: LocationSource) => {
      const matched = NigeriaData.getStates().find(
        (s) => s.name.toLowerCase() === stateName.toLowerCase(),
      );
      if (matched) {
        dispatch(setLocationState({ state: matched.name, source }));
      }
    },
    [dispatch],
  );

  const detectByGps = useCallback(async () => {
    if (!("geolocation" in navigator)) return null;

    const position: GeolocationPositionResult = await new Promise(
      (resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: false,
          timeout: GEOLOCATION_TIMEOUT_MS,
          maximumAge: 60_000,
        });
      },
    );

    const url = `${GEOCODE_URL}?format=jsonv2&lat=${position.coords.latitude}&lon=${position.coords.longitude}`;
    const response = await fetch(url, {
      headers: { Accept: "application/json" },
    });
    if (!response.ok) return null;

    const data = (await response.json()) as NominatimReverseResponse;
    return normalizeStateName(data.address?.state);
  }, []);

  const detectAndSet = useCallback(
    async (force = false) => {
      if (globalGpsAttempted && !force) return;
      globalGpsAttempted = true;
      try {
        const stateName = await detectByGps();
        if (stateName) {
          setStateFromName(stateName, "gps");
        }
      } catch {
        // Permission denied, timeout, or geocode failure — leave unset
      }
    },
    [detectByGps, setStateFromName],
  );

  /* Prefill from the logged-in user's saved address (ISO code → name) */
  useEffect(() => {
    if (locationState) return;
    const isoCode = currentUser?.address?.state;
    if (!isoCode) return;
    const matched = NigeriaData.getStateByCode(isoCode);
    if (matched) {
      dispatch(setLocationState({ state: matched.name, source: "address" }));
    }
  }, [currentUser, dispatch, locationState]);

  /* First visit + no saved address → try device GPS once */
  useEffect(() => {
    if (locationState) return;
    void detectAndSet();
  }, [locationState, detectAndSet]);

  return {
    state: locationState,
    detectAndSet,
  };
}

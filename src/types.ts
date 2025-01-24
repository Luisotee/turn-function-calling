export interface ContactLocation {
  latitude: number;
  longitude: number;
}

export interface Contact {
  birthday?: string;
  name?: string;
  surname?: string;
  whatsapp_id?: string;
  whatsapp_profile_name?: string;
  language?: string;
  location?: ContactLocation;
  opted_in?: boolean;
}

export interface RequestContext {
  wa_id: string | null;
  contact?: Contact;
  context_type?: string;
  journey_uuid?: string | null;
}

export interface FunctionRequest {
  function_name: string;
  function_args: Record<string, any>;
  context: RequestContext;
  tool_call_id: string;
}

export interface WeatherArgs {
  location: string;
}

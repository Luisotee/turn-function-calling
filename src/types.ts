export interface RequestContext {
  wa_id: string;
  contact?: {
    name?: string;
  };
}

export interface FunctionRequest {
  function_name: string;
  function_args: Record<string, any>;
  context: RequestContext;
}

export interface WeatherArgs {
  location: string;
}

export const DEFAULT_FATAL_HANDLER: '@@fetch-actions/handleFatalActions/DEFAULT_HANDLER'
export const DEFAULT_REQUEST_CREATOR: '@@fetch-actions/handleRequestCreatorActions/DEFAULT_HANDLER'
export const DEFAULT_REQUEST_TRANSFORMER: '@@fetch-actions/handleRequestTransformerActions/DEFAULT_HANDLER'
export const DEFAULT_REQUEST_HANDLER: '@@fetch-actions/handleResponderActions/DEFAULT_HANDLER'
export const DEFAULT_RESPONSE_HANDLER: '@@fetch-actions/handleResponseActions/DEFAULT_HANDLER'
export const DEFAULT_TRANSFORMER: '@@fetch-actions/handleTransformerActions/DEFAULT_TRANSFORMER'

export type MaybePromise<T> = Promise<T> | T

export type NotAPromise = Exclude<any, Promise<any>>

export interface BaseAction<T extends string> {
  type: T
}

export interface Action<T extends string, Payload> extends BaseAction<T> {
  payload: Payload
  error?: boolean
}

export interface ActionMeta<T extends string, Payload, Meta>
  extends Action<T, Payload> {
  meta: Meta
}

export type AnyAction = Action<string, any>

export type NarrowedAction<
  Actions extends AnyAction,
  ActionType extends string
> = {
  [K in Actions['type']]: Actions extends ActionMeta<
    K,
    infer Payload,
    infer Meta
  >
    ? ActionMeta<K, Payload, Meta>
    : Actions extends Action<K, infer Payload>
    ? Action<K, Payload>
    : never
}[ActionType]

export type ResponseWithJson = Pick<Response, 'json'>

export type LooseResponse =
  | ResponseWithJson
  | string
  | number
  | boolean
  | object
  | undefined
  | ReadonlyArray<string | number | boolean | object>

export interface FatalHandler<ActionTypes extends AnyAction> {
  (error: any, action: ActionTypes): any
}

export interface FetchAction<ActionTypes extends AnyAction> {
  (action: ActionTypes): Promise<any>
}

export interface Finally<ActionTypes extends AnyAction> {
  (action: ActionTypes, errored: boolean): MaybePromise<void>
}

export interface CreateFetchActionConfig<ActionTypes extends AnyAction> {
  fetch?: typeof fetch
  finally?: Finally<ActionTypes>
  requestCreator?: RequestCreator<ActionTypes>
  requestTransformer?: RequestTransformer<ActionTypes>
  responder?: Responder<ActionTypes>
  responseHandler?: ResponseHandler<ActionTypes>
  transformer?: ResponseTransformer<ActionTypes>
  fatalHandler?: FatalHandler<ActionTypes>
}

export interface Handler<State, ActionTypes extends AnyAction, Result = State> {
  (state: State, action: ActionTypes): Result
}

export type RequestTransformer<ActionTypes extends AnyAction> = Handler<
  Request,
  ActionTypes,
  MaybePromise<Request>
>

export type ResponseHandler<ActionTypes extends AnyAction> = Handler<
  ResponseWithJson,
  ActionTypes,
  MaybePromise<ResponseWithJson>
>

export type ResponseTransformer<ActionTypes extends AnyAction> = Handler<
  any,
  ActionTypes
>

export type FatalHandlerMap<ActionTypes extends AnyAction> = Partial<
  {
    readonly [K in ActionTypes['type']]: FatalHandler<
      NarrowedAction<ActionTypes, K>
    >
  } & { readonly [DEFAULT_FATAL_HANDLER]: FatalHandler<ActionTypes> }
>

export interface HandleFatalActions {
  <ActionTypes extends AnyAction>(
    fatalHandlerMap: FatalHandlerMap<ActionTypes>
  ): FatalHandler<ActionTypes>
}

export interface CreateFetchAction {
  <ActionTypes extends AnyAction>(
    config: CreateFetchActionConfig<ActionTypes>
  ): FetchAction<ActionTypes>
}

export type LooseRequest =
  | Request
  | ConstructorParameters<typeof Request>
  | ConstructorParameters<typeof Request>[0]
  | undefined
export interface RequestCreator<ActionTypes extends AnyAction> {
  (action: ActionTypes): MaybePromise<Request | undefined>
}
export interface LooseRequestCreator<ActionTypes extends AnyAction> {
  (action: ActionTypes): MaybePromise<LooseRequest>
}

export interface Responder<ActionTypes extends AnyAction> {
  (request: Request, action: ActionTypes): MaybePromise<
    ResponseWithJson | undefined
  >
}
export interface IdentityResponder<ActionTypes extends AnyAction> {
  (request: Request, action: ActionTypes): undefined
}
export interface LooseResponder<ActionTypes extends AnyAction> {
  (request: Request, action: ActionTypes): MaybePromise<LooseResponse>
}

export interface IdentityHandler<ActionTypes extends AnyAction> {
  <Payload>(payload: Payload, action: ActionTypes): Payload
}

export type ResponderMap<ActionTypes extends AnyAction> = Partial<
  {
    readonly [K in ActionTypes['type']]: LooseResponder<
      NarrowedAction<ActionTypes, K>
    >
  } & { readonly [DEFAULT_REQUEST_HANDLER]: LooseResponder<ActionTypes> }
>

export interface HandleResponderActions {
  <ActionTypes extends AnyAction>(
    responderMap: ResponderMap<ActionTypes>
  ): Responder<ActionTypes>
}

export type ResponseHandlerMap<ActionTypes extends AnyAction> = Partial<
  {
    readonly [K in ActionTypes['type']]: ResponseHandler<
      NarrowedAction<ActionTypes, K>
    >
  } & { readonly [DEFAULT_RESPONSE_HANDLER]: ResponseHandler<ActionTypes> }
>

export interface HandleResponseActions {
  <ActionTypes extends AnyAction>(
    responseHandlerMap: ResponseHandlerMap<ActionTypes>
  ): ResponseHandler<ActionTypes>
}

export type RequestCreatorMap<ActionTypes extends AnyAction> = Partial<
  {
    readonly [K in ActionTypes['type']]: LooseRequestCreator<
      NarrowedAction<ActionTypes, K>
    >
  } & { readonly [DEFAULT_REQUEST_CREATOR]: LooseRequestCreator<ActionTypes> }
>

export interface HandleRequestCreatorActions {
  <ActionTypes extends AnyAction>(
    requestCreatorMap: RequestCreatorMap<ActionTypes>
  ): RequestCreator<ActionTypes>
}

export type RequestTransformerMap<ActionTypes extends AnyAction> = Partial<
  {
    readonly [K in ActionTypes['type']]: RequestTransformer<
      NarrowedAction<ActionTypes, K>
    >
  } & {
    readonly [DEFAULT_REQUEST_TRANSFORMER]: RequestTransformer<ActionTypes>
  }
>

export interface HandleRequestTransformerActions {
  <ActionTypes extends AnyAction>(
    requestTransformerMap: RequestTransformerMap<ActionTypes>
  ): RequestTransformer<ActionTypes>
}

export type TransformerMap<ActionTypes extends AnyAction> = Partial<
  {
    readonly [K in ActionTypes['type']]: ResponseTransformer<
      NarrowedAction<ActionTypes, K>
    >
  } & { readonly [DEFAULT_TRANSFORMER]: ResponseTransformer<ActionTypes> }
>

export interface HandleTransformerActions {
  <ActionTypes extends AnyAction>(
    transformerMap: TransformerMap<ActionTypes>
  ): ResponseTransformer<ActionTypes>
}

export interface ReduceConfigs {
  <ActionTypes extends AnyAction>(
    fetch: CreateFetchActionConfig<ActionTypes>['fetch'],
    ...configs: ReadonlyArray<
      Omit<CreateFetchActionConfig<ActionTypes>, 'fetch'>
    >
  ): CreateFetchActionConfig<ActionTypes>
}

export interface ReduceFinallies {
  <ActionTypes extends AnyAction>(
    ...finallies: ReadonlyArray<Finally<ActionTypes>>
  ): Finally<ActionTypes>
}

export interface ReduceHandlers {
  <State, ActionTypes extends AnyAction, Result>(
    ...handlers: ReadonlyArray<Handler<State, ActionTypes, Result>>
  ): Handler<State, ActionTypes, Result>
}

export interface SomeFatalHandlers {
  <ActionTypes extends AnyAction>(
    ...handlers: ReadonlyArray<FatalHandler<ActionTypes>>
  ): FatalHandler<ActionTypes>
}

export interface SomeRequestCreators {
  <ActionTypes extends AnyAction>(
    ...handlers: ReadonlyArray<RequestCreator<ActionTypes>>
  ): RequestCreator<ActionTypes>
}

export interface SomeResponders {
  <ActionTypes extends AnyAction>(
    ...handlers: ReadonlyArray<Responder<ActionTypes>>
  ): Responder<ActionTypes>
}

export interface MakeJson {
  <T>(json: Promise<T>): T
  (json: any): any
}

export interface MakeRequest {
  (request: MaybePromise<LooseRequest>): MaybePromise<Request>
}

export interface MakeRequestResponse {
  (response: MaybePromise<LooseResponse>): MaybePromise<
    ResponseWithJson | undefined
  >
}

export interface MakeResponse {
  <T extends MaybePromise<any>>(response: T): T extends MaybePromise<
    ResponseWithJson
  >
    ? T
    : undefined
}

export const createFetchAction: CreateFetchAction
export const handleFatalActions: HandleFatalActions
export const handleRequestCreatorActions: HandleRequestCreatorActions
export const handleRequestTransformerActions: HandleRequestTransformerActions
export const handleResponderActions: HandleResponderActions
export const handleResponseActions: HandleResponseActions
export const handleTransformerActions: HandleTransformerActions
export const identityRequestCreator: RequestCreator<AnyAction>
export const identityResponder: IdentityResponder<AnyAction>
export const identityHandler: IdentityHandler<AnyAction>
export const makeJson: MakeJson
export const makeRequest: MakeRequest
export const makeRequestResponse: MakeRequestResponse
export const makeResponse: MakeResponse
export const reduceConfigs: ReduceConfigs
export const reduceFinallies: ReduceFinallies
export const reduceHandlers: ReduceHandlers
export const someFatalHandlers: SomeFatalHandlers
export const someRequestCreators: SomeRequestCreators
export const someResponders: SomeResponders

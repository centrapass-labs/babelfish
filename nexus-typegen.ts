/**
 * This file was generated by Nexus Schema
 * Do not make changes to this file directly
 */


import type { Context } from "./schema/context"
import type { core, connectionPluginCore } from "nexus"
declare global {
  interface NexusGenCustomInputMethods<TypeName extends string> {
    /**
     * A date string, such as 2007-12-03, compliant with the `full-date` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar.
     */
    date<FieldName extends string>(fieldName: FieldName, opts?: core.CommonInputFieldConfig<TypeName, FieldName>): void // "Date";
    json<FieldName extends string>(fieldName: FieldName, opts?: core.CommonInputFieldConfig<TypeName, FieldName>): void // "JSON";
    /**
     * A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar.
     */
    dateTime<FieldName extends string>(fieldName: FieldName, opts?: core.CommonInputFieldConfig<TypeName, FieldName>): void // "DateTime";
  }
}
declare global {
  interface NexusGenCustomOutputMethods<TypeName extends string> {
    /**
     * A date string, such as 2007-12-03, compliant with the `full-date` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar.
     */
    date<FieldName extends string>(fieldName: FieldName, ...opts: core.ScalarOutSpread<TypeName, FieldName>): void // "Date";
    json<FieldName extends string>(fieldName: FieldName, ...opts: core.ScalarOutSpread<TypeName, FieldName>): void // "JSON";
    /**
     * A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar.
     */
    dateTime<FieldName extends string>(fieldName: FieldName, ...opts: core.ScalarOutSpread<TypeName, FieldName>): void // "DateTime";
    /**
     * Adds a Relay-style connection to the type, with numerous options for configuration
     *
     * @see https://nexusjs.org/docs/plugins/connection
     */
    connectionField<FieldName extends string>(
      fieldName: FieldName,
      config: connectionPluginCore.ConnectionFieldConfig<TypeName, FieldName> & { totalCount: connectionPluginCore.ConnectionFieldResolver<TypeName, FieldName, "totalCount"> }
    ): void
  }
}


declare global {
  interface NexusGen extends NexusGenTypes {}
}

export interface NexusGenInputs {
  TicketTypeInput: { // input type
    dateTime?: NexusGenScalars['DateTime'] | null; // DateTime
    description?: string | null; // String
    fineprint?: string | null; // String
    image?: string | null; // String
    name: string; // String!
    venue?: string | null; // String
  }
  TicketedEventDetailsInput: { // input type
    name: string; // String!
  }
}

export interface NexusGenEnums {
  NetworkEnum: "CENNZnet_Azalea" | "CENNZnet_Nikau" | "CENNZnet_Rata" | "Mock"
}

export interface NexusGenScalars {
  String: string
  Int: number
  Float: number
  Boolean: boolean
  ID: string
  Date: any
  DateTime: any
  JSON: any
}

export interface NexusGenObjects {
  Address: { // root type
    address?: string | null; // ID
    id?: string | null; // ID
  }
  Health: { // root type
    status?: string | null; // String
  }
  Mutation: {};
  NFTConnection: { // root type
    edges?: Array<NexusGenRootTypes['NFTEdge'] | null> | null; // [NFTEdge]
    pageInfo: NexusGenRootTypes['PageInfo']; // PageInfo!
    totalCount?: number | null; // Int
  }
  NFTEdge: { // root type
    cursor: string; // String!
    node?: NexusGenRootTypes['NFT'] | null; // NFT
  }
  Network: { // root type
    id?: string | null; // ID
    name?: string | null; // String
  }
  PageInfo: { // root type
    endCursor?: string | null; // String
    hasNextPage: boolean; // Boolean!
    hasPreviousPage: boolean; // Boolean!
    startCursor?: string | null; // String
  }
  Query: {};
  Ticket: { // root type
    description?: string | null; // String
    id?: string | null; // ID
    image?: string | null; // String
    metadata?: NexusGenScalars['JSON'] | null; // JSON
    name?: string | null; // String
    ticketType?: NexusGenRootTypes['TicketType'] | null; // TicketType
  }
  TicketConnection: { // root type
    edges?: Array<NexusGenRootTypes['TicketEdge'] | null> | null; // [TicketEdge]
    pageInfo: NexusGenRootTypes['PageInfo']; // PageInfo!
    totalCount?: number | null; // Int
  }
  TicketEdge: { // root type
    cursor: string; // String!
    node?: NexusGenRootTypes['Ticket'] | null; // Ticket
  }
  TicketStub: { // root type
    event?: NexusGenRootTypes['TicketedEvent'] | null; // TicketedEvent
    name?: string | null; // String
    originalTicket?: NexusGenRootTypes['Ticket'] | null; // Ticket
  }
  TicketStubConnection: { // root type
    edges?: Array<NexusGenRootTypes['TicketStubEdge'] | null> | null; // [TicketStubEdge]
    pageInfo: NexusGenRootTypes['PageInfo']; // PageInfo!
    totalCount?: number | null; // Int
  }
  TicketStubEdge: { // root type
    cursor: string; // String!
    node?: NexusGenRootTypes['TicketStub'] | null; // TicketStub
  }
  TicketType: { // root type
    id?: string | null; // ID
    name?: string | null; // String
    ticketedEvent?: NexusGenRootTypes['TicketedEvent'] | null; // TicketedEvent
  }
  TicketedEvent: { // root type
    id?: string | null; // ID
    name?: string | null; // String
  }
  Transaction: { // root type
    expectedSigningAddress?: NexusGenRootTypes['Address'] | null; // Address
    id?: string | null; // ID
    result?: NexusGenRootTypes['Node'] | null; // Node
    signerPayload?: string | null; // String
    status?: string | null; // String
  }
  TransactionResult: { // root type
    result?: NexusGenRootTypes['Node'] | null; // Node
    status?: string | null; // String
  }
}

export interface NexusGenInterfaces {
  NFT: NexusGenRootTypes['Ticket'];
  Node: NexusGenRootTypes['Address'] | NexusGenRootTypes['Network'] | NexusGenRootTypes['Ticket'] | NexusGenRootTypes['TicketType'] | NexusGenRootTypes['TicketedEvent'] | NexusGenRootTypes['Transaction'];
}

export interface NexusGenUnions {
}

export type NexusGenRootTypes = NexusGenInterfaces & NexusGenObjects

export type NexusGenAllTypes = NexusGenRootTypes & NexusGenScalars & NexusGenEnums

export interface NexusGenFieldTypes {
  Address: { // field return type
    address: string | null; // ID
    createTicketedEvent: NexusGenRootTypes['Transaction'] | null; // Transaction
    id: string | null; // ID
    nfts: NexusGenRootTypes['NFTConnection'] | null; // NFTConnection
    ticketStubs: NexusGenRootTypes['TicketStubConnection'] | null; // TicketStubConnection
    tickets: NexusGenRootTypes['TicketConnection'] | null; // TicketConnection
  }
  Health: { // field return type
    status: string | null; // String
  }
  Mutation: { // field return type
    submitTransaction: NexusGenRootTypes['TransactionResult']; // TransactionResult!
  }
  NFTConnection: { // field return type
    edges: Array<NexusGenRootTypes['NFTEdge'] | null> | null; // [NFTEdge]
    pageInfo: NexusGenRootTypes['PageInfo']; // PageInfo!
    totalCount: number | null; // Int
  }
  NFTEdge: { // field return type
    cursor: string; // String!
    node: NexusGenRootTypes['NFT'] | null; // NFT
  }
  Network: { // field return type
    address: NexusGenRootTypes['Address'] | null; // Address
    id: string | null; // ID
    name: string | null; // String
  }
  PageInfo: { // field return type
    endCursor: string | null; // String
    hasNextPage: boolean; // Boolean!
    hasPreviousPage: boolean; // Boolean!
    startCursor: string | null; // String
  }
  Query: { // field return type
    health: NexusGenRootTypes['Health'] | null; // Health
    network: NexusGenRootTypes['Network'] | null; // Network
    node: NexusGenRootTypes['Node'] | null; // Node
  }
  Ticket: { // field return type
    createRedeemTransaction: NexusGenRootTypes['Transaction'] | null; // Transaction
    createTransferTransaction: NexusGenRootTypes['Transaction'] | null; // Transaction
    description: string | null; // String
    event: NexusGenRootTypes['TicketedEvent'] | null; // TicketedEvent
    id: string | null; // ID
    image: string | null; // String
    metadata: NexusGenScalars['JSON'] | null; // JSON
    name: string | null; // String
    owner: NexusGenRootTypes['Address'] | null; // Address
    ticketType: NexusGenRootTypes['TicketType'] | null; // TicketType
  }
  TicketConnection: { // field return type
    edges: Array<NexusGenRootTypes['TicketEdge'] | null> | null; // [TicketEdge]
    pageInfo: NexusGenRootTypes['PageInfo']; // PageInfo!
    totalCount: number | null; // Int
  }
  TicketEdge: { // field return type
    cursor: string; // String!
    node: NexusGenRootTypes['Ticket'] | null; // Ticket
  }
  TicketStub: { // field return type
    event: NexusGenRootTypes['TicketedEvent'] | null; // TicketedEvent
    name: string | null; // String
    originalTicket: NexusGenRootTypes['Ticket'] | null; // Ticket
  }
  TicketStubConnection: { // field return type
    edges: Array<NexusGenRootTypes['TicketStubEdge'] | null> | null; // [TicketStubEdge]
    pageInfo: NexusGenRootTypes['PageInfo']; // PageInfo!
    totalCount: number | null; // Int
  }
  TicketStubEdge: { // field return type
    cursor: string; // String!
    node: NexusGenRootTypes['TicketStub'] | null; // TicketStub
  }
  TicketType: { // field return type
    id: string | null; // ID
    name: string | null; // String
    ticketedEvent: NexusGenRootTypes['TicketedEvent'] | null; // TicketedEvent
    tickets: NexusGenRootTypes['TicketConnection'] | null; // TicketConnection
  }
  TicketedEvent: { // field return type
    createAdditionalTickets: NexusGenRootTypes['Transaction'] | null; // Transaction
    createNewTicketType: NexusGenRootTypes['Transaction'] | null; // Transaction
    id: string | null; // ID
    name: string | null; // String
    ticketStubs: NexusGenRootTypes['TicketStubConnection'] | null; // TicketStubConnection
    ticketTypes: Array<NexusGenRootTypes['TicketType'] | null> | null; // [TicketType]
    tickets: NexusGenRootTypes['TicketConnection'] | null; // TicketConnection
  }
  Transaction: { // field return type
    expectedSigningAddress: NexusGenRootTypes['Address'] | null; // Address
    id: string | null; // ID
    result: NexusGenRootTypes['Node'] | null; // Node
    signerPayload: string | null; // String
    status: string | null; // String
  }
  TransactionResult: { // field return type
    result: NexusGenRootTypes['Node'] | null; // Node
    status: string | null; // String
  }
  NFT: { // field return type
    description: string | null; // String
    id: string | null; // ID
    image: string | null; // String
    metadata: NexusGenScalars['JSON'] | null; // JSON
    name: string | null; // String
  }
  Node: { // field return type
    id: string | null; // ID
  }
}

export interface NexusGenFieldTypeNames {
  Address: { // field return type name
    address: 'ID'
    createTicketedEvent: 'Transaction'
    id: 'ID'
    nfts: 'NFTConnection'
    ticketStubs: 'TicketStubConnection'
    tickets: 'TicketConnection'
  }
  Health: { // field return type name
    status: 'String'
  }
  Mutation: { // field return type name
    submitTransaction: 'TransactionResult'
  }
  NFTConnection: { // field return type name
    edges: 'NFTEdge'
    pageInfo: 'PageInfo'
    totalCount: 'Int'
  }
  NFTEdge: { // field return type name
    cursor: 'String'
    node: 'NFT'
  }
  Network: { // field return type name
    address: 'Address'
    id: 'ID'
    name: 'String'
  }
  PageInfo: { // field return type name
    endCursor: 'String'
    hasNextPage: 'Boolean'
    hasPreviousPage: 'Boolean'
    startCursor: 'String'
  }
  Query: { // field return type name
    health: 'Health'
    network: 'Network'
    node: 'Node'
  }
  Ticket: { // field return type name
    createRedeemTransaction: 'Transaction'
    createTransferTransaction: 'Transaction'
    description: 'String'
    event: 'TicketedEvent'
    id: 'ID'
    image: 'String'
    metadata: 'JSON'
    name: 'String'
    owner: 'Address'
    ticketType: 'TicketType'
  }
  TicketConnection: { // field return type name
    edges: 'TicketEdge'
    pageInfo: 'PageInfo'
    totalCount: 'Int'
  }
  TicketEdge: { // field return type name
    cursor: 'String'
    node: 'Ticket'
  }
  TicketStub: { // field return type name
    event: 'TicketedEvent'
    name: 'String'
    originalTicket: 'Ticket'
  }
  TicketStubConnection: { // field return type name
    edges: 'TicketStubEdge'
    pageInfo: 'PageInfo'
    totalCount: 'Int'
  }
  TicketStubEdge: { // field return type name
    cursor: 'String'
    node: 'TicketStub'
  }
  TicketType: { // field return type name
    id: 'ID'
    name: 'String'
    ticketedEvent: 'TicketedEvent'
    tickets: 'TicketConnection'
  }
  TicketedEvent: { // field return type name
    createAdditionalTickets: 'Transaction'
    createNewTicketType: 'Transaction'
    id: 'ID'
    name: 'String'
    ticketStubs: 'TicketStubConnection'
    ticketTypes: 'TicketType'
    tickets: 'TicketConnection'
  }
  Transaction: { // field return type name
    expectedSigningAddress: 'Address'
    id: 'ID'
    result: 'Node'
    signerPayload: 'String'
    status: 'String'
  }
  TransactionResult: { // field return type name
    result: 'Node'
    status: 'String'
  }
  NFT: { // field return type name
    description: 'String'
    id: 'ID'
    image: 'String'
    metadata: 'JSON'
    name: 'String'
  }
  Node: { // field return type name
    id: 'ID'
  }
}

export interface NexusGenArgTypes {
  Address: {
    createTicketedEvent: { // args
      eventDetails: NexusGenInputs['TicketedEventDetailsInput']; // TicketedEventDetailsInput!
    }
    nfts: { // args
      after?: string | null; // String
      before?: string | null; // String
      event?: string | null; // String
      first?: number | null; // Int
      last?: number | null; // Int
      ticketTypeId?: string | null; // String
    }
    ticketStubs: { // args
      after?: string | null; // String
      before?: string | null; // String
      first?: number | null; // Int
      last?: number | null; // Int
    }
    tickets: { // args
      after?: string | null; // String
      before?: string | null; // String
      eventId?: string | null; // String
      first?: number | null; // Int
      last?: number | null; // Int
      ticketTypeId?: string | null; // String
    }
  }
  Mutation: {
    submitTransaction: { // args
      signature?: string | null; // String
      transactionId: string; // ID!
    }
  }
  Network: {
    address: { // args
      address: string; // String!
    }
  }
  Query: {
    network: { // args
      network: NexusGenEnums['NetworkEnum']; // NetworkEnum!
    }
    node: { // args
      id?: string | null; // ID
    }
  }
  Ticket: {
    createTransferTransaction: { // args
      toAddress: string; // String!
    }
  }
  TicketType: {
    tickets: { // args
      after?: string | null; // String
      before?: string | null; // String
      first?: number | null; // Int
      last?: number | null; // Int
    }
  }
  TicketedEvent: {
    createAdditionalTickets: { // args
      quantity?: number | null; // Int
      ticketTypeId?: string | null; // String
    }
    createNewTicketType: { // args
      quantity: number; // Int!
      ticketType: NexusGenInputs['TicketTypeInput']; // TicketTypeInput!
    }
    ticketStubs: { // args
      after?: string | null; // String
      before?: string | null; // String
      first?: number | null; // Int
      last?: number | null; // Int
    }
    tickets: { // args
      address?: string | null; // String
      after?: string | null; // String
      before?: string | null; // String
      first?: number | null; // Int
      last?: number | null; // Int
      ticketTypeId?: string | null; // String
    }
  }
}

export interface NexusGenAbstractTypeMembers {
  NFT: "Ticket"
  Node: "Address" | "Network" | "Ticket" | "TicketType" | "TicketedEvent" | "Transaction"
}

export interface NexusGenTypeInterfaces {
  Address: "Node"
  Network: "Node"
  Ticket: "NFT" | "Node"
  TicketType: "Node"
  TicketedEvent: "Node"
  Transaction: "Node"
  NFT: "Node"
}

export type NexusGenObjectNames = keyof NexusGenObjects;

export type NexusGenInputNames = keyof NexusGenInputs;

export type NexusGenEnumNames = keyof NexusGenEnums;

export type NexusGenInterfaceNames = keyof NexusGenInterfaces;

export type NexusGenScalarNames = keyof NexusGenScalars;

export type NexusGenUnionNames = never;

export type NexusGenObjectsUsingAbstractStrategyIsTypeOf = never;

export type NexusGenAbstractsUsingStrategyResolveType = "NFT" | "Node";

export type NexusGenFeaturesConfig = {
  abstractTypeStrategies: {
    isTypeOf: false
    resolveType: true
    __typename: false
  }
}

export interface NexusGenTypes {
  context: Context;
  inputTypes: NexusGenInputs;
  rootTypes: NexusGenRootTypes;
  inputTypeShapes: NexusGenInputs & NexusGenEnums & NexusGenScalars;
  argTypes: NexusGenArgTypes;
  fieldTypes: NexusGenFieldTypes;
  fieldTypeNames: NexusGenFieldTypeNames;
  allTypes: NexusGenAllTypes;
  typeInterfaces: NexusGenTypeInterfaces;
  objectNames: NexusGenObjectNames;
  inputNames: NexusGenInputNames;
  enumNames: NexusGenEnumNames;
  interfaceNames: NexusGenInterfaceNames;
  scalarNames: NexusGenScalarNames;
  unionNames: NexusGenUnionNames;
  allInputTypes: NexusGenTypes['inputNames'] | NexusGenTypes['enumNames'] | NexusGenTypes['scalarNames'];
  allOutputTypes: NexusGenTypes['objectNames'] | NexusGenTypes['enumNames'] | NexusGenTypes['unionNames'] | NexusGenTypes['interfaceNames'] | NexusGenTypes['scalarNames'];
  allNamedTypes: NexusGenTypes['allInputTypes'] | NexusGenTypes['allOutputTypes']
  abstractTypes: NexusGenTypes['interfaceNames'] | NexusGenTypes['unionNames'];
  abstractTypeMembers: NexusGenAbstractTypeMembers;
  objectsUsingAbstractStrategyIsTypeOf: NexusGenObjectsUsingAbstractStrategyIsTypeOf;
  abstractsUsingStrategyResolveType: NexusGenAbstractsUsingStrategyResolveType;
  features: NexusGenFeaturesConfig;
}


declare global {
  interface NexusGenPluginTypeConfig<TypeName extends string> {
  }
  interface NexusGenPluginInputTypeConfig<TypeName extends string> {
  }
  interface NexusGenPluginFieldConfig<TypeName extends string, FieldName extends string> {
    
  }
  interface NexusGenPluginInputFieldConfig<TypeName extends string, FieldName extends string> {
  }
  interface NexusGenPluginSchemaConfig {
  }
  interface NexusGenPluginArgConfig {
  }
}
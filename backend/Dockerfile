# Faza 1: Build
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 5000

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["JoblessAPI.csproj", "."]
RUN dotnet restore "JoblessAPI.csproj"
COPY . .
WORKDIR "/src"
RUN dotnet build "JoblessAPI.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "JoblessAPI.csproj" -c Release -o /app/publish

# Faza 2: Rulare
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "JoblessAPI.dll"]

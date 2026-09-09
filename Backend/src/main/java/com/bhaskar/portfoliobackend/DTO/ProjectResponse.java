package com.bhaskar.portfoliobackend.DTO;

public class ProjectResponse {

    private String id;
    private String title;
    private String description;
    private String imageUrl;
    private String projectUrl;
    private String githubUrl;
    private boolean published;

    public ProjectResponse() {
    }

    public ProjectResponse(
            String id,
            String title,
            String description,
            String imageUrl,
            String projectUrl,
            String githubUrl
    ) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.imageUrl = imageUrl;
        this.projectUrl = projectUrl;
        this.githubUrl = githubUrl;
    }

    public String getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public String getProjectUrl() {
        return projectUrl;
    }

    public String getGithubUrl() {
        return githubUrl;
    }
    public boolean isPublished() {
        return published;
    }
}
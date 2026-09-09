package com.bhaskar.portfoliobackend.Model;

import jakarta.validation.constraints.NotBlank;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "projects")
public class Project {

    @Id
    private String id;

    @NotBlank
    private String title;
    @NotBlank
    private String description;
    @NotBlank
    private String imageUrl;
    @NotBlank
    private String projectUrl;
    @NotBlank
    private String gitHubUrl;

    private  boolean published;

    public Project(){

    }

    public Project(String title,String description,String imageUrl,String projectUrl,String gitHubUrl){
        this.title = title;
        this.description = description;
        this.imageUrl = imageUrl;
        this.projectUrl=projectUrl;
        this.gitHubUrl=gitHubUrl;
        this.published=published;
    }

    //Getters
    public String getId(){return id;}

    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public String getGitHubUrl() {
        return gitHubUrl;
    }

    public String getProjectUrl() {
        return projectUrl;
    }
    public boolean isPublished() {
        return published;
    }

    // Setters


    public void setId(String id) {
        this.id = id;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public void setGitHubUrl(String gitHubUrl) {
        this.gitHubUrl = gitHubUrl;
    }

    public void setProjectUrl(String projectUrl) {
        this.projectUrl = projectUrl;
    }
    public void setPublished(boolean published) {
        this.published = published;
    }
}

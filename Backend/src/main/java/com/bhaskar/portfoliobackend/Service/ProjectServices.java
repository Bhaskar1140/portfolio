package com.bhaskar.portfoliobackend.Service;

import com.bhaskar.portfoliobackend.DTO.ProjectRequest;
import com.bhaskar.portfoliobackend.DTO.ProjectResponse;
import com.bhaskar.portfoliobackend.Exception.ProjectNOtFoundException;
import com.bhaskar.portfoliobackend.Model.Project;
import com.bhaskar.portfoliobackend.Repository.ProjectRepository;
import org.jspecify.annotations.NonNull;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProjectServices {
    private final ProjectRepository projectRepository;

    public ProjectServices(ProjectRepository projectRepository){
        this.projectRepository = projectRepository;
    }

    public List<ProjectResponse> getAllProjects() {

        List<Project> projects = projectRepository.findAll();

        return projects.stream()
                .map(project -> new ProjectResponse(
                        project.getId(),
                        project.getTitle(),
                        project.getDescription(),
                        project.getImageUrl(),
                        project.getProjectUrl(),
                        project.getGitHubUrl()
                ))
                .toList();
    }

    public ProjectResponse getProjectById(String id){
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ProjectNOtFoundException("Project NOT found"));
        return new ProjectResponse(
                project.getId(),
                project.getTitle(),
                project.getDescription(),
                project.getImageUrl(),
                project.getProjectUrl(),
                project.getGitHubUrl()
        );
    }

    public ProjectResponse createProject(ProjectRequest projectRequest){
        Project project = new Project();

        project.setTitle(projectRequest.getTitle());
        project.setDescription(projectRequest.getDescription());
        project.setImageUrl(projectRequest.getImageUrl());
        project.setProjectUrl(projectRequest.getProjectUrl());
        project.setGitHubUrl(projectRequest.getGithubUrl());

        Project savedProject = projectRepository.save(project);

        return new ProjectResponse(
                savedProject.getId(),
                savedProject.getTitle(),
                savedProject.getDescription(),
                savedProject.getImageUrl(),
                savedProject.getProjectUrl(),
                savedProject.getGitHubUrl()
        );
    }

    public ProjectResponse updateProject(String id, @NonNull ProjectRequest projectRequest) {
        Project existingProject = projectRepository.findById(id)
                .orElseThrow(()-> new ProjectNOtFoundException("Project NOT found"));

        existingProject.setTitle(projectRequest.getTitle());
        existingProject.setDescription(projectRequest.getDescription());
        existingProject.setImageUrl(projectRequest.getImageUrl());
        existingProject.setProjectUrl(projectRequest.getProjectUrl());
        existingProject.setGitHubUrl(projectRequest.getGithubUrl());

        Project savedProject = projectRepository.save(existingProject);

        return new ProjectResponse(
                savedProject.getId(),
                savedProject.getTitle(),
                savedProject.getDescription(),
                savedProject.getImageUrl(),
                savedProject.getProjectUrl(),
                savedProject.getGitHubUrl()
        );
    }

    public void deleteProject(String id) {

        Project existingProject = projectRepository.findById(id)
                .orElseThrow(() -> new ProjectNOtFoundException("Project NOT found"));

        projectRepository.delete(existingProject);
    }
}

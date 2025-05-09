import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, ActivityIndicator } from 'react-native';
import { useAuth } from '../../../contexts/AuthContext';
import { useRouter } from 'expo-router';
import { salvarPreferenciasUsuario, buscarPreferenciasUsuario, PreferenciasUsuario } from '../../../services/firestore';

export default function EditarPreferenciasScreen() {
  const { user } = useAuth();
  const router = useRouter();

  const [generoFavorito, setGeneroFavorito] = useState('');
  const [filmeFavorito, setFilmeFavorito] = useState('');
  const [seriadoFavorito, setSeriadoFavorito] = useState('');
  const [streaming, setStreaming] = useState('');  // Novo campo para streaming
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPreferencias() {
      if (user?.uid) {
        try {
          const preferencias = await buscarPreferenciasUsuario(user.uid);
          if (preferencias) {
            setGeneroFavorito(preferencias.generoFavorito || '');
            setFilmeFavorito(preferencias.filmeFavorito || '');
            setSeriadoFavorito(preferencias.seriadoFavorito || '');
            setStreaming(preferencias.streaming || ''); // Preenchendo o novo campo
          }
        } catch (error) {
          console.error('Erro ao carregar preferências:', error);
          Alert.alert('Erro', 'Não foi possível carregar suas preferências.');
        } finally {
          setLoading(false);
        }
      }
    }

    fetchPreferencias();
  }, [user]);

  async function handleSave() {
    try {
      setLoading(true);
  
      const preferencias: PreferenciasUsuario = {
        generoFavorito,
        filmeFavorito,
        seriadoFavorito,
        streaming, // Incluindo o novo campo para salvar
      };
  
      await salvarPreferenciasUsuario(user!.uid, preferencias);
  
      router.push('../(perfil)');
      Alert.alert('Sucesso', 'Preferências salvas!');
    } catch (error) {
      console.error('Erro ao salvar preferências:', error);
      Alert.alert('Erro', 'Não foi possível salvar suas preferências.');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <ActivityIndicator size="large" color="#f90" style={{ marginVertical: 16 }} />;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Editar Preferências</Text>

      <TextInput
        style={styles.input}
        placeholder="Gênero Favorito"
        placeholderTextColor="#aaa"
        value={generoFavorito}
        onChangeText={setGeneroFavorito}
      />

      <TextInput
        style={styles.input}
        placeholder="Filme Favorito"
        placeholderTextColor="#aaa"
        value={filmeFavorito}
        onChangeText={setFilmeFavorito}
      />

      <TextInput
        style={styles.input}
        placeholder="Seriado Favorito"
        placeholderTextColor="#aaa"
        value={seriadoFavorito}
        onChangeText={setSeriadoFavorito}
      />

      <TextInput
        style={styles.input}
        placeholder="Plataforma de Streaming"
        placeholderTextColor="#aaa"
        value={streaming}
        onChangeText={setStreaming} // Campo para editar a preferência de streaming
      />

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Salvar</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.cancelButton} onPress={() => router.back()}>
        <Text style={styles.cancelButtonText}>Cancelar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#111',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#f90',
    marginBottom: 32,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    backgroundColor: '#222',
    borderRadius: 8,
    paddingHorizontal: 16,
    height: 48,
    color: '#fff',
    marginBottom: 16,
  },
  saveButton: {
    backgroundColor: '#f90',
    borderRadius: 8,
    width: '100%',
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  saveButtonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
  },
  cancelButton: {
    backgroundColor: '#333',
    borderRadius: 8,
    width: '100%',
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
